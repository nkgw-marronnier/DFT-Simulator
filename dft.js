var siki = 0;
var sample = 0;
var P = 0;
var jissuu = [];
var sum = 0;
var fd = [];

event();
graph();

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
  }
  if (chart2) {
    chart2.destroy();
  }
  event();
  graph();
}

function event() {

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

  // 原関数定義
  function func_y(x) {
    if (siki == 0) {
      return 1 * Math.sin(2 * x);
    } else if (siki == 1) {
      return 1 * Math.sin(8 * x);
    } else if (siki == 2) {
      return 5 * Math.sin(20 * x);
    } else if (siki == 3) {
      return 1 * Math.sin(2 * x) + 1 * Math.cos(4 * x);
    }
  }

  let f = new Array(P);
  // データサンプリング
  for (let m = 0; m < P; m++) {
    f[m] = func_y(((2.0 * Math.PI) / P) * m);
  }
  for (let i = 0, len = f.length; i < len; i++) {
    fd[i] = f[i];
    sum += 1;
  }

  // DFT係数計算
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
    jissuu[n] = Math.round(x * 100) / 100;
  }
}

function graph() {

  var flabel = [...Array(sum).keys()]

  const mydata = {
    labels: flabel,

    datasets: [{
      label: '時間領域',
      data: fd,
      borderColor: '#5f5',
      fill: false
    }],
  };
  var ctx = document.getElementById('canvas').getContext('2d');
  window.chart = new Chart(ctx, {

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

  var ctx2 = document.getElementById('canvas2').getContext('2d');
  const mydata2 = {
    labels: flabel,

    datasets: [{
      label: '周波数領域',
      data: jissuu,
      backgroundColor: '#aaf'
    }]
  };

  window.chart2 = new Chart(ctx2, {

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
  sum = 0;
}