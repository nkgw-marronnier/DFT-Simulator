var siki = 0;
var sample = 0;
var P = 0;

function button() {
  var shiki = document.getElementsByName("siki");
  for (let i = 0; i < shiki.length; i++) {
    if (shiki[i].checked) {
      siki = i;
    }
  }
  var hyouhon = document.getElementsByName("sample");
  for (let i = 0; i < hyouhon.length; i++) {
    if (hyouhon[i].checked) {
      sample = i;
    }
  }

  if (chart) {
    chart.destroy();
    chart2.destroy();
  }

  event();
}

function event() {

  console.log(siki);

  if (sample == 0) {
    P = 10;
  } else if (sample == 1) {
    P = 50;
  } else if (sample == 2) {
    P = 100;
  } else if (sample == 3) {
    P = 500;
  } else if (sample == 4) {
    P = 1000;
  }
  var jissuu = [];

  // 原関数定義
  function func_y(x) {
    if (siki == 0) {
      console.log(1);
      return 1 * Math.sin(2 * x);
    } else if (siki == 1) {
      console.log(2);
      return 1 * Math.sin(8 * x);
    } else if (siki == 2) {
      return 5 * Math.sin(20 * x);
    } else if (siki == 3) {
      return 1 * Math.sin(2 * x) + 1 * Math.cos(4 * x);
    }
    //return 1 * Math.sin(2 * x) + 7.0 * Math.cos(3.0 * x);
  }

  let f = new Array(P);
  // データサンプリング
  for (let m = 0; m < P; m++) {
    f[m] = func_y(((2.0 * Math.PI) / P) * m);
    //console.log(f[m]);
  }
  var sum = 0;
  for (let i = 0, len = f.length; i < len; i++) {
    sum += 1;
  }
  var flabel = [...Array(sum).keys()]


  const canvas = document.getElementById('canvas');
  const mydata = {
    labels: flabel,

    datasets: [{
      label: '時間領域',
      data: f,
      borderColor: '#5f5',
      fill: false
    }],
  };
  const chart = new Chart(canvas, {

    type: 'line',
    data: mydata,
    options: {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: '時間[t] →'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: '振幅'
          }
        }]
      }
    }
  });

  // DFT係数計算
  //console.log("次数\t実数部\t虚数部\t絶対値");
  for (let n = 0; n < P; n++) {
    let ar = 0.0;
    let ai = 0.0;
    let x;
    for (let m = 0; m < P; m++) {
      x = ((2.0 * Math.PI) / P) * m * n;
      ar += f[m] * Math.cos(-x);
      ai += f[m] * Math.sin(-x);
    }
    ar /= P;
    ai /= P;
    x = Math.sqrt(4.0 * ar * ar + 4.0 * ai * ai);
    /*console.log(
      n,
      Math.round(ar * 100) / 100,
      Math.round(ai * 100) / 100,
      Math.round(x * 100) / 100
    );*/
    jissuu[n] = Math.round(x * 100) / 100;
  }

  const canvas2 = document.getElementById('canvas2');
  const mydata2 = {
    labels: flabel,

    datasets: [{
      label: '周波数領域',
      data: jissuu,
      backgroundColor: '#aaf'
    }]
  };
  const chart2 = new Chart(canvas2, {

    type: 'bar',
    data: mydata2,
    options: {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: '周波数[Hz] →'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: '大きさ'
          }
        }]
      }
    }
  });

}

event();