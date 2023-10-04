// const { JSDOM } = require( "jsdom" );
// const { window } = new JSDOM( "" );
// const $ = require( "jquery" )( window );//jq呼叫



const url = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-F5F950CC-0504-4F8B-A2F1-8DBC3F188CAA&format=JSON&sort=time"

// fetch會最後執行(非同步，整個DOM render後，用事件監聽觸發才讀的到，不會在頁面載入前啟用)

fetch(url)
.then((res)=>{
    return res.json();
}).then((data)=>{
    wet = data.records.location; 
}).catch((err)=>{
    console.log(err)
});
// fetch 部分


let Jsondata=[];//json原始檔案
let replyZone = document.getElementById('replyZone');
const selectCity = document.getElementById('selectCity');//選擇城市的input
const theTime = document.getElementById('cityTime'); //選擇時間的input
const replyIMG = document.getElementById('replyIMG');

// 選單觸發填入選項，換選項時搜尋目標程式
function getlocaldata(){
    const KeyWord =selectCity.value;
    // console.log(KeyWord)//確認目標值

var targetcity = Jsondata.filter((i)=>{
        return  i.locationName == KeyWord;
    })
var targetcityTime =targetcity[0].weatherElement[0].time
// console.log(targetcityTime)

    // 選單觸發填入選項，換選項時搜尋目標程式
    const selectTime = document.getElementById('cityTime')//目標城市的時段選單
        selectTime.innerHTML=""//先清空，不然之後會一直累加
        replyZone.innerHTML=""
        targetcityTime.forEach(i=>{
            selectTime.innerHTML+=`<option>${i.startTime}</option>`//將起始時間填進去
    })
    //以下錯誤的思考方向 

    // console.log(targetcityTime[0].startTime);
    // console.log(selectTime.value)    //這兩個是一樣的 值可以比對陣列
    // function compare(){

    //     switch (selectTime.value){//判斷哪個是當前值
    //         case selectTime[0].innerHTML:
    //             // console.log(targetcityTime[0].parameter.parameterName)測試成功可以穩定取天氣
    //             replyZone.innerText=targetcityTime[0].parameter.parameterName;
    //             break
    //         case selectTime[1].innerHTML:
    //             // console.log(targetcityTime[1].parameter.parameterName)
    //             replyZone.innerText=targetcityTime[1].parameter.parameterName;
    //             break
    //         case selectTime[2].innerHTML:
    //             // console.log(targetcityTime[2].parameter.parameterName)
    //             replyZone.innerText=targetcityTime[2].parameter.parameterName;
    //             break
    //     }
    // }
    // setInterval(compare,500);//持續刷新
    
    //以上錯誤的方向
}

window.addEventListener('click',()=>{
    Array.from(wet).forEach(i=>Jsondata.push(i));//把JSON推進去空陣列Jsondata   
    wet.forEach(i=>{
        selectCity.innerHTML +=`<option>${i.locationName}</option>`
    })
},{once:true})  //選單內填入所有JSON取得的縣市名稱 第三個參數{once:true}表示只能觸發一次 才不會一直加載



function getWeather(){
    const timePick = theTime.value;//當前選中時間
    const theCity= selectCity.value;//當前選中城市
    //Jsondata 上面處理過的陣列
    // console.log(theCity,timePick,Jsondata);
    Jsondata.forEach(i=>{
            if(theCity==i.locationName){//遍歷每一個locationName 符合當前選中城市才繼續往下執行
                // console.log(Jsondata[0].weatherElement[0].time[0].parameter)//這一層到time陣列了
            }
    })
    for(a=0;a<Jsondata.length;a++){
        if(Jsondata[a].locationName==theCity){
            // console.log('第'+a) //取得城市的index號  
            var currentWeather=Jsondata[a].weatherElement;
                // console.log(currentWeather[0].time.length)//長度3  
            var fullReply=[];//每次回答都要清空陣列
            replyZone.innerText =""; //跑迴圈前先清乾淨回答區
            for (i=0;i<currentWeather.length;i++){
                for(j=0;j<currentWeather[i].time.length;j++){
                    // if(currentWeather.time[j+1].startTime==timePick){
                    //     console.log(WeatherElement[i].time[j].parameter.parameterName)
                    // }
                    if(currentWeather[i].time[j].startTime==timePick){
                        
                        fullReply.push(currentWeather[i].time[j].parameter.parameterName)
                    }
                }
            }
            // currentCity.forEach(i=>{if(i.startTime==timePick){
            //     replyZone.innerText = i.parameter.parameterName;
            // }})
        }
    }
    // console.log(fullReply)
    replyZone.innerHTML = `天氣:${fullReply[0]}</br>降雨率:${fullReply[1]}%</br>最低溫:${fullReply[2]}度C、最高溫:${fullReply[4]}度C</br>體感溫度:${fullReply[3]}`;
    //以上OK完整進度----------------------------------------------------------------------------------------    
    if(fullReply[0].includes("雨")){
        replyIMG.src="/img/ame.jpg";
    }else if(fullReply[0].includes("晴")){
        replyIMG.src="/img/hare.jpg";
    }else{
        replyIMG.src="/img/kumo.jpg";
    }
};

