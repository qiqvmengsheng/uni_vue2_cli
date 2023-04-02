/* eslint-disable no-param-reassign */
/**
 * 将onenet返回的数组对象数据整理成echart使用的对象数组数据
 * @param {Array.Object.Array.Object} data onenet返回的数据
 * @returns {Object.Array}
 */
export function disposalData(data) {
  if (!(data instanceof Object)) return null;
  const chartdata = { RadonAt: [] };
  const datalength = data.length;
  // 整理数据为对象数组
  let i = 0;
  while (i < datalength) {
    const { datapoints } = data[i];
    const { id } = data[i];
    chartdata[id] = [];
    const dlength = datapoints.length;

    let k = dlength - 1;
    while (k >= 0) {
      chartdata[id].push(datapoints[k].value);
      k -= 1;
    }
    // 添加氡数据时间数组
    if (id === 'Radon') {
      let t = dlength - 1;
      while (t >= 0) {
        chartdata.RadonAt.push(datapoints[t].at);
        t -= 1;
      }
    }
    i += 1;
  }
  // for (let j of data) {
  //   let b = j.id;
  //   chartdata[b] = [];
  //   for (let i of j.datapoints) {
  //     chartdata[b].push(i.value);
  //   }
  //   // 添加氡数据时间数组
  //   if (b == "Radon") {
  //     for (let i of j.datapoints) {
  //       chartdata["RadonAt"].push(i.at);
  //     }
  //   }
  // }
  // 判断是有地图数据,反向至最新
  if (Object.prototype.hasOwnProperty.call(chartdata, 'Map'))
    chartdata.Map.reverse();
  return chartdata;
}

/**
 * 数组求和
 * @param {Array} arr
 * @returns {Number} 数组之和
 */
export const sumArr = (arr) => arr.reduce((acc, val) => acc + val, 0);

/**
 * 求数组平均值方法
 * @param {Array} arr
 * @returns {Number} 数组平均值
 */
export const average = (arr) => sumArr(arr) / arr.length;

/**
 * 求数组方差方法
 * @param {Array} arr
 * @returns {Number} 数组方差
 */
export const variance = (arr) => {
  const aver = average(arr);
  // console.log(arr.reduce((acc, val) => acc + Math.pow(average - val, 2), 0));
  return arr.reduce((acc, val) => acc + (aver - val) ** 2, 0) / arr.length;
};

/**
 * 求数组标准差方法
 * @param {Array} arr
 * @returns {Number} 数组标准差
 */
export const deviation = (arr) => Math.sqrt(variance(arr));

/**
 * 计算数组标准差与平均值之和之差
 * @param {Array} arr 需要计算的数组
 * @param {Number} startValue 需要计算的数据的起始位下标
 * @param {Number} endValue 需要计算的数据的结束位下标
 * @param {Boolean} fuhao 正负号，true为和，false为差
 * @param {Number} beishu 标准差的倍数
 * @returns {Number}
 */
export const hezhi = (arr, startValue, endValue, fuhao, beishu) => {
  const a = average(arr.slice(startValue, endValue + 1));
  const b = deviation(arr.slice(startValue, endValue + 1));
  if (fuhao) {
    return a + b * beishu;
  }
  return a - b * beishu;
};

/**
 * 去除str字符串中的所有空格转大写
 * @param {String} str 需要去空格转大写的字符串
 * @returns {String}
 */
export const restring = (str) => str.replace(/\s*/g, '').toUpperCase();

/**
 * 生成能谱数组
 * @param {Array} datas1 原始数据
 * @param {Number} startv 截取数据起始点下标
 * @param {Number} endv 截取数据结束点下标
 * @returns {Array} 能谱信道之和的数组。
 */
export const PlotData = (datas1, startv, endv) => {
  const a = [];
  if (startv === undefined || startv === null || startv === '') {
    for (let i = 1; i <= 38; i += 1) {
      a.push(sumArr(datas1[`Plot_${i}`]));
      // if (i === 9 || i === 15 || i === 20 || i === 27) {
      //   a.push("-");
      // }
    }
  } else {
    for (let i = 1; i <= 38; i += 1) {
      a.push(sumArr(datas1[`Plot_${i}`].slice(startv, endv + 1)));
      // if (i === 9 || i === 15 || i === 20 || i === 27) {
      //   a.push(0);
      // }
    }
  }
  return a;
};

/**
 * json深拷贝方法
 * @param {Object} obj
 * @returns {Object}
 */
export function jsonClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

//
/**
 * 夜间返回true，白天返回false，（这里夜间时间设置为17:00 -- 06:00）
 * @returns {boolean}
 */
export function isDaylight() {
  const currdate = new Date();
  if (currdate.getHours() >= 17 || currdate.getHours() < 6) {
    return true;
  }
  return false;
}

/**
 * 深度清空对象值保留结构
 * @param {Object} obj
 */
export function clearValue(obj) {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      clearValue(obj[key]);
    } else {
      obj[key] = '';
    }
  });
}

/**
 * 测量值修正
 */
export function calAHum(h, t) {
  const humidity = +h;
  const temperature = +t;
  return (
    (humidity *
      6112.13 *
      Math.exp((17.5043 * temperature) / (241.2 + temperature))) /
    (461.52 * (273.15 + temperature))
  );
}

export function calHumCorr({ humidity, temperature }) {
  const CmaHum = 0.025;
  const CaHum0 = 10;
  return 1 + CmaHum * (calAHum({ humidity, temperature }) - CaHum0);
}

export function calRadon({ Radon, humidity, temperature }) {
  return (
    (Radon / calHumCorr({ humidity, temperature })) *
    calHumCorr({ humidity: 75, temperature: 20 })
  );
}

/**
 * 生成一个用不重复的ID
 * GenNonDuplicateID()将生成 rfmipbs8ag0kgkcogc 类似的ID
 */
export function GenNonDuplicateID(randomLength) {
  return Number(
    Math.random().toString().substring(3, randomLength) + Date.now()
  ).toString(36);
}

/**
 * 去除文件树的空文件夹
 */
export function filterFileFolder(arr) {
  const temp = [];
  arr.forEach((i) => {
    if (!i.children || i.children.length !== 0) {
      temp.push({ ...i });
    }
  });
  // const temp = arr.filter((x) => !x.children || x.children.length !== 0);
  temp.forEach((x) => {
    if (x.children && x.children.length > 0)
      x.children = filterFileFolder(x.children);
  });
  return temp;
}

/**
 * 去除文件树的空文件夹，判断是否去除干净
 */
export function filterEmptyFolder(arr) {
  const str = JSON.stringify(arr);
  const temp = filterFileFolder(arr);
  if (JSON.stringify(temp) === str) {
    return temp;
  }
  return filterEmptyFolder(temp);
}

/**
 * 树结构广度优先遍历
 * @param {Array} tree 树结构
 * @param {Function} func  执行方法
 */
export function treeForeach(tree, func) {
  let node;
  const list = [...tree];
  while (list.length) {
    node = list.shift();
    func(node);
    if (node.children) list.push(...node.children);
  }
}

/**
 * 树结构深度优先递归
 * @param {Object[]} tree 树结构
 * @param {Function} func  执行方法
 */
export function treeRecursion(tree, func) {
  tree.forEach((data) => {
    func(data);
    if (data.children) treeRecursion(data.children, func); // 遍历子树
  });
}
