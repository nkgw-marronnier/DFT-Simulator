/*
The MIT License (MIT)

Copyright (c) 2020 nkgw-marronnier

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// dft-ue.js @nkgw-marronnier 2020
// DFT計算部分のアルゴリズムは @sudahiroshi より引用
// https://github.com/sudahiroshi/simple_dft
// chartの単位表示は @PikachuPunch より引用
// https://qiita.com/PikachuPunch/items/ca68f457cfecb32b6eda

var P = 0;
var jissuu = new Array();
var sum = 1;
var fd = new Array();

// 初回実行
calculate2();
graph2();

// 入力欄の確認とグラフの更新
function check() {
  // 入力欄のエラー確認
  if (form1.formula1.value == "" || form1.sample.value == "" || form1.formula2.value == "" || form1.formula3.value == "" || form1.formula4.value == "") {
    alert("説明欄をよく読んでから数式, またはサンプル数を「正しく」入力しよう.");
    return false;
  } else {
    // サンプル数のエラー確認
    if (form1.sample.value > 5000) {
      alert("その数値の大きさでは端末が固まってしまいます. 5000以下の値を入力しましょう.");
      return false;
    } else if (form1.sample.value <= 2) {
      alert("その数値の小ささでは計算不能です. よく考えて3以上の値を入力しましょう. ");
      return false;
    } else {
      // グラフインスタンスの初期化
      if (chart3) {
        chart3.destroy();
      }
      if (chart4) {
        chart4.destroy();
      }
      // 更新
      jissuu.length = 0;
      fd.length = 0;
      sum = 1;
      calculate2();
      graph2();
      return true;
    }
  }
}

// DFT計算アルゴリズム
function calculate2() {

  // フォーム入力から標本数を取得
  P = form1.sample.value;

  // フォーム入力から値を取得
  var a, b, c, d = 0;
  a = form1.formula1.value;
  b = form1.formula2.value;
  c = form1.formula3.value;
  d = form1.formula4.value;

  // 原関数定義
  function func_y(x) {
    // フォーム入力から原関数を定義
    var e, g, h = 0;
    if (form1.sankaku.selectedIndex == 0) {
      e = a * Math.sin(b * x);
    } else {
      e = a * Math.cos(b * x);
    }
    if (form1.sankaku2.selectedIndex == 0) {
      g = c * Math.sin(d * x);
    } else {
      g = c * Math.cos(d * x);
    }
    if (form1.hugou.selectedIndex == 0) {
      h = e + g;
    } else {
      h = e - g;
    }
    return h;
  }

  let f = new Array(P);
  // データサンプリング
  for (let m = 0; m < P; m++) {
    f[m] = func_y(((2.0 * Math.PI) / P) * m);
    // これはグラフ用であって標本化には関係ない
    fd.push(f[m]);
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
    jissuu.push(Math.round(x * 100) / 100);
  }
}

// グラフ描画
function graph2() {

  // x軸の要素配列を作成
  var flabel2 = [...Array(sum - 1).keys()]

  // 時間領域
  var ctx3 = document.getElementById('canvas3').getContext('2d');

  const mydata3 = {
    labels: flabel2,

    datasets: [{
      label: '時間領域',
      data: fd,
      borderColor: '#858',
      fill: false
    }],
  };

  window.chart3 = new Chart(ctx3, {

    type: 'line',
    data: mydata3,
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
  var ctx4 = document.getElementById('canvas4').getContext('2d');
  const mydata4 = {
    labels: flabel2,

    datasets: [{
      label: '周波数領域',
      data: jissuu,
      backgroundColor: '#f55',
    }]
  };

  window.chart4 = new Chart(ctx4, {

    type: 'bar',
    data: mydata4,
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
}