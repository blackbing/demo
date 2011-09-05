<?
/*
  �{�� : big5 �r��B�z��ƶ�
  �ɦW : big5_func.inc
  �@�� : Pigo Chu<pigo@ms5.url.com.tw>
  ���� :
	�o�Ǩ�ƬO�H PHP4 �ӳB�z big5 �r��
	����H���i�H�ۥѴ��G���{��
	�g�o�ǵ{���O�ݨ� LinuxFab �W�Q�װϤW�ܦh�H��������D�~�g��
	�ڤ���O�ҷ|�o�ͤ�����D , �Y�� bug �ШӫH�Q�פ��n��|
  �ɶ� : 2002/4/21
  ���� : 0.10
  
  �������� :
  0.01 ��(2001/5/27) ���Ѫ����
  string big5_addslashes(string str) : �P PHP addslashes �@�˪��\�� , �i�H�B�z����
  string big5_stripslashes(string str) : �P stripslashes �@��
  int big5_strlen(string str) : �P strlen �\��ۦP
  string big5_substr(string str,int start , int length) : �P substr �@��
  string big5_strtolower(string str) : �P strtolower �@��
  string big5_strtoupper(string str) : �P strtoupper �@��
  
  0.02 ��(2001/5/28) ���Ѫ����
  string big5_chunk_split(string $str, [int $chunklen=76] , [string $end="\r\n"]) : �P chunk_split �ۦP
  
  0.03 ��(2001/6/16) ���Ѫ����
  string big5_strpos(string haystack ,string needle , int [offset]) : �Ǧ^�Ĥ@�ӧ�� $str ����m

  0.04 ��(2001/11/12) �ק� bug
  ��@�ǩw�q�P�P�_�����g���ץ� , �P�º��ͤp�� ...
  
  0.05 ��(2002/2/13) �ץ� big5_stripslashes()
  ����Ʒ|��Ҧ� "\" �h�������D , ���º���Neil����
  
  0.06 ��(2002/2/22) �s�W big5_str_replace()
  ����ƥΪk�P str_replace() �@��
  
  0.07 ��(2002/4/12) �s�W int big5_stroke($string) 
  ����ƥi�p���@����r������ , �Y��J�����O����hreturn false
   
  0.08 ��(2002/4/19) �s�W big5_unicode($string) , big5_utf8_encode(),big5_utf8_decode(), �ק� big5_stroke($string) 
  big5_unicode() �i�H�N�����ন�h��y���������Ϊ��X
  big5_utf8_encode() �i�H�N�����ন UTF8 �X
  big5_utf8_decode() �i�H�N UTF8 �ন BIG5 �X
  big5_stroke() �令�}�ɤ覡 , �o�ˤ��Ψ즹��Ʈɤ���ٰO����

  0.09 �äߪ� (2002/4/20) �ץ��\�h��Ƽg�k , ���@�į�
  �ڴ��� : big5 �� utf �P big5 �� unicode ���@�į� 0.08 ���į� 10 ���H�W
  ���� 1 �U �Ӥ���r�� utf8 �j���ݭn 2.2 �� , ��e�@��(�~�M�W�L2�����֤W�D�`�h)
  ���M�٤��O�����N , ���L�w�g�i�H����
  �t�~ big5_substr , big5_strlen ��F�@�Ǽg�k�Ҧ��֤F�@�I�I ...
  
  0.10 �� (2002/4/21) ���@ bi5 �� utf8 , unicode , �į�A���ɥ[�� 2 ��
  �ڧڦۤv���q������ , ���� 1 �U����r�� utf8 �w�g�i�H�C�� 1 ��F ...
  big5_substr() ���g�]�[�֤F�@�I�I�t��
  
*/

define("BIG5_FILE_DIR" , "./");   // ���禡�w�s�񪺦�m , �ܭ��n��

define("BIG5_HB_MIN" , 0x81);	// ���줸�ճ̤p��
define("BIG5_HB_MAX" , 0xfe);	// ���줸�ճ̤j��
define("BIG5_LB1_MIN" , 0x40);	// �C�줸�ճ̤p��
define("BIG5_LB1_MAX" , 0x7e);	// �C�줸�ճ̤j��
define("BIG5_LB2_MIN" , 0xa1);	// �C�줸�ճ̤p��
define("BIG5_LB2_MAX" , 0xfe);	// �C�줸�ճ̤j��


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
       $isHB = 0;		// BIG5 �����줸���ѧO��
       $isLB = 0;		// BIG5 ���C�줸���ѧO��
       $s1 = substr($str,$i,1);
       if(!$isHB && big5_isHB($s1)) // �Ĥ@�Ӧr�ŦX���줸��
       {
           $isHB = 1;
           $s2 = substr($str,$i+1,1);
           if( big5_isLB($s2) )  // �ĤG�Ӧr�ŦX�C�줸��
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
       $isHB = 0;		// BIG5 �����줸���ѧO��
       $isLB = 0;		// BIG5 ���C�줸���ѧO��
       $s1 = substr($subject,$i,1);
       if(!$isHB && big5_isHB($s1))
       {
           $isHB = 1;
           $s2 = substr($subject,$i+1,1);
           if( big5_isLB($s2) ) // �ĤG�Ӧr�ŦX�C�줸��
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
       $isHB = 0;		// BIG5 �����줸���ѧO��
       $isLB = 0;		// BIG5 ���C�줸���ѧO��
       $s1 = $str[$i];
       if(!$isHB && big5_isHB($s1))
       {
           $isHB = 1;
           $s2 = $str[($i+1)];
           if( big5_isLB($s2) ) // �ĤG�Ӧr�ŦX�C�줸��
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

// �p�⤤��r����
function big5_stroke($str)
{
    $tab=@File(BIG5_FILE_DIR  ."/big5_stroke.tab");
    if(!$tab)
    {
    	 echo "Can't Open file big5_stroke.tab, plz check define BIG5_FILE_DIR is valid";
    	 exit;
    }
    /* Ū���ഫ��ܰ}�C $StrokeMapping */
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
    /* Ū���ഫ��ܰ}�C $UNICODE */
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
    // Ū�� big5 �� utf8 ���
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
    // Ū�� utf8 �� big5 ���
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

        else if ( $check>>5 == 6 ) // AscII > 127 ���S��Ÿ�
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

echo big5_stroke("��");

?>
