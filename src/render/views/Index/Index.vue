<template>
  <div id="container"></div>
  <div class="input-card">
    <h4>轨迹回放控制</h4>
    <div class="input-item">
      <input
        type="button"
        class="btn"
        value="开始动画"
        id="start"
        @click="startAnimation()"
      />
      <input
        type="button"
        class="btn"
        value="暂停动画"
        id="pause"
        @click="pauseAnimation()"
      />
    </div>
    <div class="input-item">
      <input
        type="button"
        class="btn"
        value="继续动画"
        id="resume"
        @click="resumeAnimation()"
      />
      <input
        type="button"
        class="btn"
        value="变速动画"
        id="stop"
        @click="changeSpeed()"
      />
    </div>
  </div>
</template>

<script setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted, shallowRef } from "vue";
import "@/render/views/Index/demo-center.css";
const map = shallowRef(null);
onMounted(() => {
  initMap();
});

const initMap = () => {
  AMapLoader.load({
    key: "357562a613134875275d279c6a75471a", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.MarkerCluster", "AMap.MoveAnimation"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      map.value = new AMap.Map("container", {
        //设置地图容器id
        zoom: 17, //初始化地图级别
        center: [116.478935, 39.997761], //初始化地图中心点位置
        // center: [108.705117, 34.333439], //初始化地图中心点位置
      });
      initCar();
    })
    .catch((e) => {
      console.log(e);
    });
};

const marker = shallowRef(null);
const lineArr = [
  [116.478935, 39.997761],
  [116.478939, 39.997825],
  [116.478912, 39.998549],
  [116.478912, 39.998549],
  [116.478998, 39.998555],
  [116.478998, 39.998555],
  [116.479282, 39.99856],
  [116.479658, 39.998528],
  [116.480151, 39.998453],
  [116.480784, 39.998302],
  [116.480784, 39.998302],
  [116.481149, 39.998184],
  [116.481573, 39.997997],
  [116.481863, 39.997846],
  [116.482072, 39.997718],
  [116.482362, 39.997718],
  [116.483633, 39.998935],
  [116.48367, 39.998968],
  [116.484648, 39.999861],
];
let speed = 0.5;
const initCar = () => {
  // 小车移动轨迹

  // 这是小汽车
  marker.value = new AMap.Marker({
    map: map.value,
    position: [116.478935, 39.997761],
    icon: "https://webapi.amap.com/images/car.png",
    //点标记显示位置偏移量，默认值为Pixel(-10,-34)。 因为图片都是矩形的 放到地图上可能位置不太对 通过这个属性 可以调一调位置
    offset: new AMap.Pixel(-26, -13),
    //是否自动旋转  点标记在使用moveAlong动画时，路径方向若有变化，点标记是否自动调整角度，默认为false。广泛用于自动调节车辆行驶方向。
    autoRotation: true,
    //点标记的旋转角度，广泛用于改变车辆行驶方向
    // 因为图片 可能方向不太对  通过这个旋转一下图片，但是这个不要和autoRotation 混淆了哦， 这个angle是图片刚加载出来之后的旋转角度，autoRotation是在angle基础上进行旋转哦
    angle: -90,
  });

  // 小汽车还未走的路
  const polyline = new AMap.Polyline({
    map: map.value,
    path: lineArr,
    showDir: true,
    strokeColor: "#28F", //线颜色
    strokeWeight: 6, //线宽
  });
  // 小汽车已经走过的路线
  const passedPolyline = new AMap.Polyline({
    map: map.value,
    strokeColor: "#AF5", //线颜色
    strokeWeight: 6, //线宽
  });
  //监听小车移动事件
  marker.value.on("moving", function (e) {
    //passedPath为Marker对象在moveAlong或者moveTo过程中已经走过的路径
    //通过passedPath 给passedPolyline 设置path 也就是让他开始画绿色的线
    passedPolyline.setPath(e.passedPath);
  });
  // 可以加个这个方法  这个让屏幕 聚焦在小汽车
  map.value.setFitView();
};

const startAnimation = () => {
  // 第一个参数标识这个标记 移动的路径， 第二个是移动的速度
  //第三个参数 是变化曲线函数 可以动态控制 移动速度
  marker.value.moveAlong(lineArr, 200, function (e) {
    // e 是 当前小汽车 在路径中的比值
    // 路径是由多个坐标组成, e 不是整个路径的比值
    // e 是每两个坐标点之间的比值 从0 到 1
    // return 返回的值 就是改变小汽车在路径上的比值 ,比如现在走了一半(e为0.5),这时候return 0.8 那小车就会移动到 0.8的位置上,视觉上小车移动速度就变快了,但是不能超过1 超过1 就 跑出路径了
    return e * speed > 1 ? 1 : e * speed;
  });
};

const pauseAnimation = () => {
  // 这是暂停动画 调用resumeMove 还能继续动
  marker.value.pauseMove();
};

const resumeAnimation = () => {
  // 继续执行的方法
  marker.value.resumeMove();
};
// 改变小汽车移动速度
const changeSpeed = () => {
  marker.value.pauseMove();
  //改变小车移动速度,这里要注意 需要暂停 再继续 不然会有小车倒退的问题出现
  speed = speed === 2 ? 1 : 2;
  marker.value.resumeMove();
};
</script>

<style scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100vw;
  height: 100vh;
}

.input-card .btn {
  margin-right: 1.2rem;
  width: 9rem;
}

.input-card .btn:last-child {
  margin-right: 0;
}
</style>
