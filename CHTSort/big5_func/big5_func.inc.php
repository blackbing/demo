<?
/*
  程式 : big5 字串處理函數集
  檔名 : big5_func.inc
  作者 : Pigo Chu<pigo@ms5.url.com.tw>
  說明 :
	這些函數是以 PHP4 來處理 big5 字元
	任何人都可以自由散佈本程式
	寫這些程式是看見 LinuxFab 上討論區上很多人有中文問題才寫的
	我不能保證會發生什麼問題 , 若有 bug 請來信討論不要謾罵
  時間 : 2002/4/21
  版本 : 0.10
  
  版本介紹 :
  0.01 版(2001/5/27) 提供的函數
  string big5_addslashes(string str) : 與 PHP addslashes 一樣的功能 , 可以處理中文
  string big5_stripslashes(string str) : 與 stripslashes 一樣
  int big5_strlen(string str) : 與 strlen 功能相同
  string big5_substr(string str,int start , int length) : 與 substr 一樣
  string big5_strtolower(string str) : 與 strtolower 一樣
  string big5_strtoupper(string str) : 與 strtoupper 一樣
  
  0.02 版(2001/5/28) 提供的函數
  string big5_chunk_split(string $str, [int $chunklen=76] , [string $end="\r\n"]) : 與 chunk_split 相同
  
  0.03 版(2001/6/16) 提供的函數
  string big5_strpos(string haystack ,string needle , int [offset]) : 傳回第一個找到 $str 的位置

  0.04 版(2001/11/12) 修改 bug
  把一些定義與判斷式的寫錯修正 , 感謝網友小藍 ...
  
  0.05 版(2002/2/13) 修正 big5_stripslashes()
  此函數會把所有 "\" 去掉的問題 , 謝謝網友Neil指正
  
  0.06 版(2002/2/22) 新增 big5_str_replace()
  此函數用法與 str_replace() 一樣
  
  0.07 版(2002/4/12) 新增 int big5_stroke($string) 
  此函數可計算單一中文字的筆劃 , 若輸入的不是中文則return false
   
  0.08 版(2002/4/19) 新增 big5_unicode($string) , big5_utf8_encode(),big5_utf8_decode(), 修改 big5_stroke($string) 
  big5_unicode() 可以將中文轉成多國語言給網頁用的碼
  big5_utf8_encode() 可以將中文轉成 UTF8 碼
  big5_utf8_decode() 可以將 UTF8 轉成 BIG5 碼
  big5_stroke() 改成開檔方式 , 這樣不用到此函數時比較省記憶體

  0.09 嘔心版 (2002/4/20) 修正許多函數寫法 , 提昇效能
  據測試 : big5 轉 utf 與 big5 轉 unicode 提昇效能 0.08 版效能 10 倍以上
  測試 1 萬 個中文字轉 utf8 大約需要 2.2 秒 , 比前一版(居然超過2分鐘快上非常多)
  雖然還不是挺滿意 , 不過已經可以接受
  另外 big5_substr , big5_strlen 改了一些寫法所有快了一點點 ...
  
  0.10 版 (2002/4/21) 提昇 bi5 轉 utf8 , unicode , 效能再提升加快 2 倍
  據我自己的電腦測試 , 測試 1 萬中文字轉 utf8 已經可以低於 1 秒了 ...
  big5_substr() 重寫也加快了一點點速度
  
*/

define("BIG5_FILE_DIR" , "./");   // 本函式庫存放的位置 , 很重要喔

define("BIG5_HB_MIN" , 0x81);	// 高位元組最小值
define("BIG5_HB_MAX" , 0xfe);	// 高位元組最大值
define("BIG5_LB1_MIN" , 0x40);	// 低位元組最小值
define("BIG5_LB1_MAX" , 0x7e);	// 低位元組最大值
define("BIG5_LB2_MIN" , 0xa1);	// 低位元組最小值
define("BIG5_LB2_MAX" , 0xfe);	// 低位元組最大值


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

function big5_global_func($str,$func)
{
   $return_str = "";
   for($i=0; $i<strlen($str); $i++)
   {
       $isHB = 0;		// BIG5 的高位元組識別用
       $isLB = 0;		// BIG5 的低位元組識別用
       $s1 = substr($str,$i,1);
       if(!$isHB && big5_isHB($s1)) // 第一個字符合高位元組
       {
           $isHB = 1;
           $s2 = substr($str,$i+1,1);
           if( big5_isLB($s2) )  // 第二個字符合低位元組
             $isLB = 1;   
       }
       if($isLB && $isHB) {
           $return_str.= $s1.$s2;
           $i++;
       }
       else
       {
           switch($func)
           {
               case "addslashes":
                   $return_str.= addslashes($s1);
                   break;
               case "stripslashes":
               
                   if($s1 == "\\")
                   {  
                       $s2 = substr($str,$i+1,1);
                       if($s2  == "\\")
                           $return_str .= "\\";
                       else
                           $return_str .=$s2 ;
                       $i++;

                   }
                   else $return_str .=$s1;
                   break;
               
               case "strtolower":
                   $return_str.= strtolower($s1);
                   break;
               case "strtoupper":
                   $return_str.= strtoupper($s1);           
                   break;
           }
       }
   }
   

   return $return_str;
}

function big5_addslashes($str) {
   return big5_global_func($str,"addslashes");
}
function big5_stripslashes($str) {
   return big5_global_func($str,"stripslashes");
}
function big5_strtolower($str) {
   return big5_global_func($str,"strtolower");
}
function big5_strtoupper($str) {
   return big5_global_func($str,"strtoupper");
}
function big5_str_replace($search , $replace, $subject)
{
   for($i=0; $i<strlen($subject); $i++)
   {
       $isHB = 0;		// BIG5 的高位元組識別用
       $isLB = 0;		// BIG5 的低位元組識別用
       $s1 = substr($subject,$i,1);
       if(!$isHB && big5_isHB($s1))
       {
           $isHB = 1;
           $s2 = substr($subject,$i+1,1);
           if( big5_isLB($s2) ) // 第二個字符合低位元組
             $isLB = 1;   
       }
       if($isLB && $isHB)
       {
           $first_str = $s1.$s2;
           if($first_str == substr($search,0,2))
           {
               if( substr($subject,$i,strlen($search)) == $search )
               {

                   $return_str .= $replace;
                   $i+=strlen($search)-1;
               }
               else 
               {
                   $return_str .= $first_str;
                   $i++;
               }
           }
           else
           {
               $return_str .= $first_str;
               $i++;
           }
       }
       else
       {
           $first_str = $s1;
           if($first_str == substr($search,0,1))
           {
               if( substr($subject,$i,strlen($search)) == $search )
               {

                   $return_str .=  $replace;
                   $i+=strlen($search)-1;
               }
               else $return_str .= $first_str;
           }
           else $return_str .= $first_str;
       }
   }
   return $return_str;
}


function big5_strlen($str)
{
   $return_len = 0;
   for($i=0; $i<strlen($str); $i++)
   {
       $isHB = 0;		// BIG5 的高位元組識別用
       $isLB = 0;		// BIG5 的低位元組識別用
       $s1 = $str[$i];
       if(!$isHB && big5_isHB($s1))
       {
           $isHB = 1;
           $s2 = $str[($i+1)];
           if( big5_isLB($s2) ) // 第二個字符合低位元組
             $isLB = 1;   
       }
       if($isLB && $isHB) $i++;
       $return_len++;
   }
   return $return_len;
}

function big5_substr($str,$start,$len=0)
{
   $offset = 0;
   if(!$len) $len = strlen($str);
   $str_len =  strlen($str);
   $start = $start-1;
   for($i=0; $i< $str_len; $i++)
   {
     if($offset>$start)
     {
       if(big5_isHB($str[$i]) && big5_isLB($str[($i+1)]))
       {
               $return_str .= $str[$i].$str[$i+1];
               $i++;
       }
       else $return_str .= $str[$i];
       if($offset-$start >= $len) break;
     }
     else if(big5_isHB($str[$i]) && big5_isLB($str[($i+1)]))
         $i++;
     $offset ++;
   }  
   return $return_str;
}



function big5_strpos($haystack ,$needle ,$offset=0) 
{
    $needle_len = big5_strlen($needle);
    $len =big5_strlen($haystack);
    for($i=$offset ; $i<$len ; $i++)
    {
        if(big5_substr($haystack,$offset+$i,$needle_len) == $needle)
            return $i;
    }
    return false;
}

function big5_chunk_split($str, $chunklen=76 , $end="\r\n")
{
   for($i=0 ; $i<big5_strlen($str) ; $i+=$chunklen)
      return big5_substr($str,$i,$chunklen) .$end;
}

// 計算中文字筆劃
function big5_stroke($str)
{
    $tab=@File(BIG5_FILE_DIR  ."/big5_stroke.tab");
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

function big5_unicode($str)
{
    $tab=@File(BIG5_FILE_DIR  ."/big5_uni.tab");
    
    if(!$tab)
    {
    	 echo "Can't Open file big5_uni.tab, plz check define BIG5_FILE_DIR is valid";
    	 exit;
    }
    /* 讀取轉換表至陣列 $UNICODE */
    while(list($key,$val)=Each($tab)) 
        $UNICODE[substr($val,0,4)] = substr($val,5,4);
    // unset($tab);
    $str_len =  strlen($str);

    for($i=0; $i< $str_len; $i++)
    {
      if(big5_isHB($str[$i]) && big5_isLB($str[($i+1)]))
      {
          $s = $str[$i].$str[$i+1];
          $i++;
      }
      else $s = $str[$i];

        if(strlen($s) == 1)
           $ret_str .= "&#" . Hexdec(bin2hex($s)) . ";";
        else
           $ret_str .= "&#" . hexdec($UNICODE[bin2hex($s)]) . ";";
    }  

    return $ret_str;
}



function big5_utf8_encode($str)
{
    // 讀取 big5 轉 utf8 表格
    $tab = unserialize(@fread(@fopen(BIG5_FILE_DIR  ."/big5_utf8.tab" , "r"),fileSize(BIG5_FILE_DIR  ."/big5_utf8.tab")));

    if(!is_array($tab))
    {
    	 echo "Can't Open file big5_utf8.tab, plz check define BIG5_FILE_DIR is valid";
    	 exit;
    }
   $str_len =  strlen($str);
   for($i=0; $i< $str_len; $i++)
   {
      if(big5_isHB($str[$i]) && big5_isLB($str[($i+1)]))
      {
          $s = $str[$i].$str[$i+1];
          $i++;
      }
      else $s = $str[$i];
      $ret_str.= $tab[bin2hex($s)];
   }  
   return $ret_str;
}

function big5_utf8_decode($str)
{
    // 讀取 utf8 轉 big5 表格
    $tab = unserialize(@fread(@fopen(BIG5_FILE_DIR  ."/utf8_big5.tab" , "r"),fileSize(BIG5_FILE_DIR  ."/utf8_big5.tab")));

    if(!$tab)
    {
    	 echo "Can't Open file utf8_big5.tab, plz check define BIG5_FILE_DIR is valid";
    	 exit;
    }

    $len = strlen($str);
    for($i=0 ; $i<$len ; $i++)
    {
    	$check = Ord($str[$i]);
        if( $check >> 7 == 0)
            $ret_str .= chr($check);

        else if ( $check>>5 == 6 ) // AscII > 127 的特殊符號
        {
            $ret_str .= $tab[bin2hex($str[$i].$str[$i+1])];
            $i++;
        }
        else if ( $check>> 4 == 0xe)
        {
             $ret_str .= $tab[bin2hex($str[$i].$str[$i+1].$str[$i+2])];
            $i+=2;
        }

    }
   return $ret_str;
}

echo big5_stroke("王");

?>
