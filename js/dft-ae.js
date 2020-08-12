/*
The MIT License (MIT)

Copyright (c) 2020 nkgw-marronnier

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// dft-ae.js @nkgw-marronnier 2020
// DFT計算部分のアルゴリズムは @sudahiroshi より引用
// https://github.com/sudahiroshi/simple_dft
// chartの単位表示は @PikachuPunch より引用
// https://qiita.com/PikachuPunch/items/ca68f457cfecb32b6eda

var siki = 0;
var sample = 0;
var P = 0;
var jissuu = new Array();
var sum = 0;
var fd = new Array();

// 初回実行
calculate();
graph();

// ラジオボタン押下で呼び出される
function button() {
  // 離散フーリエ変換する式の選択
  var shiki = document.getElementsByName("siki");
  for (let i = 0; i < shiki.length; i++) {
    if (shiki[i].checked) {
      siki = i;
    }
  }
  // 標本数の選択
  var hyouhon = document.getElementsByName("sample");
  for (let i = 0; i < hyouhon.length; i++) {
    if (hyouhon[i].checked) {
      sample = i;
    }
  }
  // グラフインスタンスの初期化
  if (chart) {
    chart.destroy();
  }
  if (chart2) {
    chart2.destroy();
  }
  //更新
  calculate();
  graph();
}

// DFT計算アルゴリズム
function calculate() {
  // 標本数選択
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
  } else if (sample == 5) {
    P = 5000;
  }

  // 原関数定義
  function func_y(x) {
    // 離散フーリエ変換する数式の選択
    if (siki == 0) {
      return 1 * Math.sin(2 * x);
    } else if (siki == 1) {
      return 1 * Math.sin(8 * x);
    } else if (siki == 2) {
      return 4 * Math.sin(20 * x);
    } else if (siki == 3) {
      return 1 * Math.sin(49 * x);
    } else if (siki == 4) {
      return 1 * Math.sin(2 * x) + 1 * Math.cos(4 * x);
    }
  }

  let f = new Array(P);
  // データサンプリング
  for (let m = 0; m < P; m++) {
    f[m] = func_y(((2.0 * Math.PI) / P) * m);
    // これはグラフ用であって標本化には関係ない
    fd = f[m];
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
    jissuu[m] = Math.round(x * 100) / 100;
  }
}

// グラフ描画
function graph() {

  // x軸の要素配列を作成
  var flabel = [...Array(sum).keys()]

  // 時間領域
  var ctx = document.getElementById('canvas').getContext('2d');

  const mydata = {
    labels: flabel,

    datasets: [{
      label: '時間領域',
      data: fd,
      borderColor: '#5f5',
      fill: false
    }],
  };

  window.chart = new Chart(ctx, {

    type: 'line',
    data: mydata,
    options: {
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            return data.labels[tooltipItem.index] +
              " 標本目のとき " +
              data.datasets[0].data[tooltipItem.index] +
              " の値を取得";
          }
        }
      },
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
            labelString: '振幅 →'
          }
        }]
      }
    }
  });

  // 周波数領域
  var ctx2 = document.getElementById('canvas2').getContext('2d');
  const mydata2 = {
    labels: flabel,

    datasets: [{
      label: '周波数領域',
      data: jissuu,
      backgroundColor: '#56f'
    }]
  };

  window.chart2 = new Chart(ctx2, {

    type: 'bar',
    data: mydata2,
    options: {
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            return data.labels[tooltipItem.index] +
              " Hz目のとき " +
              data.datasets[0].data[tooltipItem.index] +
              " の大きさ";
          }
        }
      },
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
            labelString: '大きさ →'
          }
        }]
      }
    }
  });
  jissuu.length = 0;
  fd.length = 0;
  sum = 0;
}