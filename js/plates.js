/* ============================================================
   PLATES —— 图版数据
   每份：图 + 编号 + 标题 + 正文 + 版式
   layout: cols2（双栏公文） / cols1（单栏） / hand（手写）
   ============================================================ */
var PLATES = [

/* ---------------- 01 立案文书 ---------------- */
{
  id:'p01', pl:31, pr:8.5, roman:'I', no:'01', img:'assets/plate-01.webp',
  name:'證 物 一', title:'立 案 文 書', layout:'cols2',
  body:`
    <p>逕啟者：</p>
    <p>本年十月十四日，據本口緝私艇報稱，霞浦縣屬三沙灣外，有漁船一艘，名「順發」，船牌閩霞字第〇四七號，自十月十一日出港後，迄今未歸。</p>
    <p>查該船船主林阿水，年四十一歲，三沙澳人。船員五名：林阿火（船主之弟）、陳水來、王番薯、許乞食、鄭炎生。均係本澳漁戶。</p>
    <p>又查：該船係民國十五年三月初二領牌，牌載「煙囪式硬帆一副」，於十六年換。本年十月十一日清晨出港，未經汛口掛驗。據澳甲稱，該船並未報關。</p>
    <p>按現行船政法，漁船出港須報澳甲、掛汛口，違者以走私論。惟近年海上不靖，各澳多有未報即出者，積習已久，本關亦難盡究。</p>
    <p>本關已飭沿海各汛口一體查訪。相應函請　貴公署查照，派員查勘，並取具該船船主族鄰保結，以備核銷。</p>
    <p class="noindent" style="text-align:right;margin-top:1.4em;">署理閩海關稅務司　<span class="redact">▉▉▉</span><br>民國十七年十月十四日</p>
  `
},

/* ---------------- 02 现场照片 ---------------- */
{
  id:'p02', pl:35, pr:9, roman:'II', no:'02', img:'assets/plate-02.webp',
  name:'證 物 二', title:'現 場 照 片', layout:'cols1 big',
  body:`
    <p class="noindent" style="letter-spacing:.14em;">三沙灣　　順發船　　民國十七年十月　　共三張</p>
    <p class="noindent small" style="margin-top:.6em;">攝影：本關稽查員，借澳中照相館鏡箱。</p>
    <p class="noindent" style="border-top:.5px solid rgba(80,62,38,.22);margin:1em 0 1.2em;"></p>
    <p>一、船首殘舵一段，長約四尺，木質，有嚙痕。</p>
    <p>二、網具一具，網目盡破，破口整齊。</p>
    <p>三、澳口灘上足印，自水際起，止於社廟階前。</p>
    <p>以上照片三張，附袋移送。</p>
    <p class="noindent" style="margin-top:1.1em;"><b>袋中實存二張。</b></p>
    <p class="noindent" style="margin-top:2em;font-size:12.5px;opacity:.72;">（袋上浮簽）第三張　沖印於十月十六</p>
    <p class="noindent" style="font-size:12.5px;opacity:.72;">晚於案發兩日。</p>
    <p class="noindent" style="margin-top:2.2em;font-size:13px;opacity:.8;">（批註）第三張底片，袋中無。<br>尋三日。得於礁石上，已沖。</p>
  `
},

/* ---------------- 03 村民笔录 ---------------- */
{
  id:'p03', pl:31, pr:8.5, roman:'III', no:'03', img:'assets/plate-03.webp',
  name:'證 物 三', title:'村 民 筆 錄', layout:'cols2',
  body:`
    <p class="noindent small">（節六份　餘存關）</p>
    <table class="depo">
      <tr><th>問</th><td>十月十一日，汝在何處？</td></tr>
      <tr><th>答</th><td>在澳裏補網。討海人不出海，就在補網。</td></tr>
      <tr><th>問</th><td>可見「順發」出港？</td></tr>
      <tr><th>答</th><td>看見。天未光就出去。<b>潮水正漲。</b>船上六個人。</td></tr>
    </table>
    <table class="depo">
      <tr><th>問</th><td>十月十一日，汝在何處？</td></tr>
      <tr><th>答</th><td>在澳裏補網。</td></tr>
      <tr><th>問</th><td>可見「順發」出港？</td></tr>
      <tr><th>答</th><td>看見。<b>潮水正退。</b>船上六個人。</td></tr>
    </table>
    <table class="depo">
      <tr><th>問</th><td>當日有無異樣？</td></tr>
      <tr><th>答</th><td><span class="dialect">「有看著好兄弟咧。」</span></td></tr>
      <tr><th>譯</th><td>稱：見有不應見之物。</td></tr>
    </table>
    <table class="depo">
      <tr><th>問</th><td>船可曾翻？</td></tr>
      <tr><th>答</th><td>（不答）</td></tr>
      <tr><th colspan="2" class="rec-note">記錄員註：被問人不肯答此字。</td></tr>
    </table>
    <table class="depo">
      <tr><th>問</th><td>船可曾翻？</td></tr>
      <tr><th>答</th><td>（不答）</td></tr>
      <tr><th colspan="2" class="rec-note">記錄員註：二次問，仍不答。</td></tr>
    </table>
    <table class="depo">
      <tr><th>問</th><td>船上有幾人？</td></tr>
      <tr><th>答</th><td>六個。</td></tr>
      <tr><th>問</th><td>連同船主？</td></tr>
      <tr><th>答</th><td>六個。</td></tr>
      <tr><th colspan="2" class="rec-note">記錄員註：船牌載船主一名、船員五名。</td></tr>
    </table>
    <table class="depo">
      <tr><th>問</th><td>帆上所書何字？</td></tr>
      <tr><th>答</th><td>無看。</td></tr>
      <tr><th>問</th><td>汝每日見此船，何以不看？</td></tr>
      <tr><th>答</th><td>（不答）</td></tr>
    </table>
  `
},

/* ---------------- 04 渔船档案 ---------------- */
{
  id:'p04', pl:33, pr:8.5, roman:'IV', no:'04', img:'assets/plate-04.webp',
  name:'證 物 四', title:'漁 船 檔 案', layout:'cols1',
  body:`
    <p class="noindent" style="letter-spacing:.16em;">福建霞浦縣　漁船船牌存根</p>
    <p class="noindent" style="border-top:.5px solid rgba(80,62,38,.24);margin:.9em 0 1.1em;"></p>
    <dl class="shipcard">
      <dt>船　牌</dt><dd>閩霞字第〇四七號</dd>
      <dt>船　名</dt><dd class="ship-name">順　發</dd>
      <dt>船　式</dt><dd>十三股艚</dd>
      <dt>船　主</dt><dd>林阿水</dd>
      <dt>保　結</dt><dd>族鄰　林阿火、陳水來；澳甲　王番薯</dd>
      <dt>發　證</dt><dd>民國十五年三月初二</dd>
    </dl>
    <p style="margin-top:1.3em;font-size:13.5px;opacity:.85;">帆面兩側，應用油墨大字書寫縣分、船戶姓名，自帆頂至帆腳，不得過五六字。</p>
    <p class="noindent" style="margin-top:1.2em;font-size:16px;">帆上所書：「霞浦　<u>順　興</u>」</p>
    <p class="noindent" style="margin-top:.7em;font-size:15px;letter-spacing:.2em;"><b>與船牌不符。</b></p>
    <p class="noindent" style="margin-top:2.2em;font-size:12.5px;opacity:.7;">（夾簽）帆非原帆。重寫於發證之後。<br>——何人所寫？</p>
  `
},

/* ---------------- 05 生还者讯问 ---------------- */
{
  id:'p05', pl:38, pr:7, roman:'V', no:'05', img:'assets/plate-05.webp',
  name:'證 物 五', title:'生 還 者 訊 問', layout:'cols2',
  body:`
    <p class="noindent small">被訊問人：鄭炎生，年十九，三沙澳人。<br>十月廿七日於東衝口外拾獲。</p>
    <p class="noindent seg">第一日　十月廿七</p>
    <p>問：船在何處出事？<br>答：南邊。過了白犬。</p>
    <p>問：如何出事？<br>答：風。船底破了。</p>
    <p>問：其餘五人？<br>答：沉了。</p>
    <p>問：你如何不死？<br>答：抱着舵。</p>
    <p class="noindent seg">第二日　十月廿八</p>
    <p>問：昨日所言，可再述一遍？<br>答：（照第一日所言，一字不差。）</p>
    <p>問：出事時，水深幾何？<br>答：摸不到底。</p>
    <p class="noindent seg">第三日　十月廿九</p>
    <p>問：船在何處出事？<br>答：<b>不在海上。</b></p>
    <p>問：不在海上，在何處？<br>答：在下面。街上也有。<b>街上跟澳裏一樣。</b></p>
    <p>問：你見到何人？<br>答：見着他們五個。他們在走路。<b>他們沒有影子。</b></p>
    <p>問：他們往何處去？<br>答：往海去。</p>
    <p>問：你可曾叫他們？<br>答：叫了。<b>他們回頭了。</b></p>
    <p>問：回頭之後？<br>答：<b>回頭的時候，還是一樣朝前走。</b></p>
    <p>問：此話何意？<br>答：（不答。雙手掩面。約一刻。）</p>
    <p>問：你如何能回來？<br>答：我沒有回頭。</p>
    <p>問：何以此前不言？<br>答：<b>問的人不是你們。</b></p>
    <p class="noindent" style="margin-top:1.2em;">（被訊問人按：<span class="thumb">■■■■■</span>）</p>
  `
},

/* ---------------- 06 回收物清单 ---------------- */
{
  id:'p06', pl:52, pr:6.5, roman:'VI', no:'06', img:'assets/plate-06.webp',
  name:'證 物 六', title:'回 收 物 清 單', layout:'cols1',
  body:`
    <p class="noindent small">三沙灣外海面撈獲物件　民國十七年十月廿五日　覆寫一份</p>
    <table class="carbon">
      <tr><td>〇一</td><td>舵板一段</td><td>四尺二寸</td><td>有嚙痕</td></tr>
      <tr><td>〇二</td><td>漁網一具</td><td>破</td><td>破口齊整</td></tr>
      <tr><td>〇三</td><td>木牌一枚</td><td>三寸</td><td>刻字</td></tr>
      <tr><td>〇四</td><td>瓷碗半隻</td><td>—</td><td>碗底有字</td></tr>
      <tr><td>〇五</td><td>草席一張</td><td>濕</td><td>捲起，內空</td></tr>
      <tr><td>〇六</td><td>紙船一艘</td><td>二尺</td><td><b>未燒完</b></td></tr>
      <tr class="gap"><td>〇七</td><td colspan="3">（此欄空白）</td></tr>
      <tr><td>〇八</td><td>布鞋一雙</td><td>男式</td><td>鞋底無泥</td></tr>
      <tr><td>〇九</td><td>油紙一束</td><td>—</td><td>潮，字盡失</td></tr>
      <tr><td>一〇</td><td>銅鈕一枚</td><td>—</td><td>非本澳樣式</td></tr>
      <tr><td>一一</td><td>牙一隻</td><td>二寸</td><td>齒面有刻紋</td></tr>
      <tr><td>一二</td><td>玻璃瓶</td><td>半截</td><td>內有泥沙，無塞</td></tr>
    </table>
    <p style="margin-top:1.2em;">以上共 <b>十三</b> 件。<br>本清單係覆寫件，原件存關。</p>
    <p class="noindent" style="margin-top:1.8em;font-size:12.5px;opacity:.7;">（硃筆旁註）十件。編號至〇九。<br>〇七從未存在。</p>
  `
},

/* ---------------- 07 未归档 ---------------- */
{
  id:'p07', pl:33, pr:8, roman:'VII', no:'07', img:'assets/plate-07.webp',
  name:'附 錄', title:'未 歸 檔', layout:'hand',
  body:`
    <p class="noindent small">（非公文紙。另夾卷中。字為鋼筆。）</p>
    <p>十月初十日。受縣署命，抄錄本案卷宗。教員本不熟公事，字寫得難看，科員罵了我兩回。</p>
    <p>十一月十二日。今日抄到第四份。船名在船牌上是「順發」，在帆上是「順興」。科員說我抄錯。我看了三遍，不是我抄錯。</p>
    <p class="key">十一月十三日。我核了七次。不是我看錯。</p>
    <p>十一月十四日。第六份清單抄到一半，我發現中間少一個號。我不敢問。</p>
    <p>十一月十五日。我今天從頭再看了一遍。第四頁船名，是「順發」。<br>我記得昨天是「順興」。</p>
    <p>十一月十六日。我又看了。這一次，兩個字都不是。</p>
    <p class="broken">十一月十七日。卷宗在夜裡自己翻了一頁。我沒有開窗。桌上有水。</p>
    <p class="broken2">十一月十八日。這卷不是給人看的。科員今天沒來。沒有人來。我在抄一份沒有人會讀的東西。</p>
    <p>十一月十五日夜。我試着把這卷壓在書下。壓了一夜。第二日，它在上頭。</p>
    <p>十一月十六日。我問澳裏討海人：這卷裏的船，你們認得否。他們看我一眼，都不說話。<br>只有一個老的，講：「你莫問。問了就輪着你。」</p>
    <p class="broken">十一月十七日夜。我數第三遍了。還是七個手印。其中一個的指頭，比我多兩節。</p>
    <p class="broken2">十一月十八日。燈沒熄。窗沒開。我坐着沒動。我聽見有人在翻紙。</p>
  `
}

];
