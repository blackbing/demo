<?

/*
 * Author: blackbing@gmail.com
 * Desc: 為了解決中文筆劃排序的問題(只適用繁體中文)
 * php 可以直接執行cht_strokesort
 * http API : http://localhost/cht_strokesort.php?compare=%E9%A9%A2%E5%AD%90,%E5%8F%B2%E7%91%9E%E5%85%8B,%E7%99%BD%E9%9B%AA%E5%85%AC%E4%B8%BB,%E9%95%B7%E9%9D%B4%E8%B2%93,%E5%B0%8F%E6%9C%A8%E5%81%B6,%E8%96%91%E9%A4%85%E4%BA%BA,     %E4%B8%80,%E4%BA%8C,%E4%B8%89,a,b,c,1,2,5,%E4%B8%83&callback=test&dont_sort=true
 * 注意一定要用UTF8 encodeURIComponent傳遞參數 
 */

define("BIG5_HB_MIN" , 0x81);   // 高位元組最小值                                                                                                                                                                                     
define("BIG5_HB_MAX" , 0xfe);   // 高位元組最大值
define("BIG5_LB1_MIN" , 0x40);  // 低位元組最小值
define("BIG5_LB1_MAX" , 0x7e);  // 低位元組最大值
define("BIG5_LB2_MIN" , 0xa1);  // 低位元組最小值
define("BIG5_LB2_MAX" , 0xfe);  // 低位元組最大值


function big5_isHB($c) {
      $asc = Ord($c);
      if($asc>=BIG5_HB_MIN && $asc<=BIG5_HB_MAX) return true;
        return false;
}

function big5_isLB($c) {
      $asc = Ord($c);
      if(($asc>=BIG5_LB1_MIN && $asc<=BIG5_LB1_MAX)  || ($asc>=BIG5_LB2_MIN && $asc<=BIG5_LB2_MAX))
                return true;
        return false;
}

function utf8_2_big5($utf8_str) {
    $i=0;
    $len = strlen($utf8_str);
    $big5_str="";
    for ($i=0;$i<$len;$i++) {
        $sbit = ord(substr($utf8_str,$i,1));
        if ($sbit < 128) {
            $big5_str.=substr($utf8_str,$i,1);
        } else if($sbit > 191 && $sbit < 224) {
            $new_word=iconv("UTF-8","Big5",substr($utf8_str,$i,2));
            $big5_str.=($new_word=="")?(mb_convert_encoding(substr($utf8_str,$i,3), 'HTML-ENTITIES', 'UTF-8')):$new_word;
            $i++;
        } else if($sbit > 223 && $sbit < 240) {
            $new_word=iconv("UTF-8","Big5",substr($utf8_str,$i,3));
            $big5_str.=($new_word=="")?(mb_convert_encoding(substr($utf8_str,$i,3), 'HTML-ENTITIES', 'UTF-8')):$new_word;
            $i+=2;
        } else if($sbit > 239 && $sbit < 248) {
            $new_word=iconv("UTF-8","Big5",substr($utf8_str,$i,4));
            $big5_str.=($new_word=="")?(mb_convert_encoding(substr($utf8_str,$i,3), 'HTML-ENTITIES', 'UTF-8')):$new_word;
            $i+=3;
        }    
    }    
    return $big5_str;
}

// 計算中文字筆劃
function big5_stroke($str)
{
    $tab=@File("./big5_stroke.tab");
    if(!$tab)
    {    
        echo "Can't Open file big5_stroke.tab, plz check define BIG5_FILE_DIR is valid";
        exit;
    }    
    /* 讀取轉換表至陣列 $StrokeMapping */
    $i=0;
    while(list($key,$val)=Each($tab))
    {    
        $StrokeMapping[$i] = split(" ",$val);
        $StrokeMapping[$i][1] = HexDec($StrokeMapping[$i][1]);
        $StrokeMapping[$i][2] = HexDec($StrokeMapping[$i][2]);
        $i++;
    }    

    $s1 = substr($str,0,1);
    $s2 = substr($str,1,1);
    $s  = Hexdec(Bin2hex($s1.$s2));

    if( big5_isHB($s1) && big5_isLB($s2) )
    {    
        for($i=0;$i<count($StrokeMapping);$i++)
            if($StrokeMapping[$i][1] <= $s && $StrokeMapping[$i][2] >= $s)                                                                                                                                                                  
                return $StrokeMapping[$i][0];
    }    
    else 
        return false;
}

function get_string_stroke($str){
    $str = utf8_2_big5($str);
    $stroke = big5_stroke($str);
    return $stroke;
}

function ucompare($a, $b){
    if ($a['ord'] == $b['ord']) {
        return 0;
    }
    return ($a['ord'] < $b['ord']) ? -1 : 1;
}

function cht_strokesort($str_arr, $dontSort = false){

    $ord_arr = array();
    //若是英數字，則依照ord來做排序，而筆劃排序則由base開始起算
    $stroke_base = 50000;
    while (list($key, $value) = each($str_arr)) {
        $value = urldecode($value);
        $firstChar = mb_substr($value, 0, 1, 'UTF-8');
        $stroke = get_string_stroke($firstChar);
        if($stroke>0){
            $ord = $stroke_base + $stroke;
        }else{
            $ord = ord($firstChar);
        }
        $ord_arr[] = array(
            'firstChar' => $firstChar,
            'stroke' => $stroke?$stroke:-1,
            'ord' => $ord,
            'original_index' => $key,
            'string' => $value
        );
        
    }
    //若指定不排序
    if(!$dontSort){
        usort($ord_arr, "ucompare");
    }
    //    print_r($ord_arr);
    return $ord_arr;

}

/*
$string = array('驢子','史瑞克','白雪公主','長靴貓','小木偶','薑餅人','三隻小豬','睡美人','壞皇后','七個小矮人','小美人魚','神仙教母', '龜', '台', '灣', '1', '2', '3', 'a', 'b', 'c', '一', '二', '三', '許', '功', '蓋');
$sorted = cht_strokesort($string);
foreach($sorted as $k => $v){
    $index = $v['original_index'];
    echo $string[$index].",";
}
 */

//http API: http://localhost/CHTSort/cht_strokesort.php?compare=%E9%A9%A2%E5%AD%90,%E5%8F%B2%E7%91%9E%E5%85%8B,%E7%99%BD%E9%9B%AA%E5%85%AC%E4%B8%BB,%E9%95%B7%E9%9D%B4%E8%B2%93,%E5%B0%8F%E6%9C%A8%E5%81%B6,%E8%96%91%E9%A4%85%E4%BA%BA,%E4%B8%80,%E4%BA%8C,%E4%B8%89,a,b,c,1,2,5,%E4%B8%83&callback=test&dont_sort=true
//
if(isset($_GET['compare'])){
    $arr = split(',', $_GET['compare']);
    $dontSort = $_GET['dont_sort']?true:false;
    $sorted = cht_strokesort($arr, $dontSort);
    //為了減少http的傳輸, 原本傳入的字串不做回傳 
    foreach($sorted as $k => $v){
        unset($sorted[$k]['string']);
    }
    $callback = $_GET['callback'];
    if($callback){
        echo $callback."(";
    }
    echo json_encode($sorted);
    if($callback){
        echo ")";
    }
}
?>                                                                                                                                                                     
