<template>
  <div>
    <view class="container">
      <view style="text-align: center">
        <canvas
          id="lottie_demo"
          type="2d"
          :style="{
            display: 'inline-block',
            width: `${width}px`,
            height: `${height}px`,
          }"
        />
        <!-- <button @tap="init" style="width: 300px">初始化</button>
        <button @tap="play" style="width: 300px">播放</button>
        <button @tap="pause" style="width: 300px">暂停</button> -->
      </view>
    </view>
  </div>
</template>

<script>
import lottie from 'lottie-miniprogram';

let ani = null; // 必须放在外面，uni里不要挂在this上,否则会触发循环引用的报错
export default {
  data() {
    return {
      inited: false,
    };
  },
  props: {
    width: { type: String, default: '300' },
    height: { type: String, default: '300' },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.inited) {
        return;
      }
      this.createSelectorQuery()
        .select('#lottie_demo')
        .node((res) => {
          console.log('传入大小', this.width, this.height);
          // console.log(res); // 节点对应的 Canvas 实例。
          const canvas = res.node;
          const context = canvas.getContext('2d');
          canvas.width = parseInt(this.width, 10);
          canvas.height = parseInt(this.height, 10);
          lottie.setup(canvas);
          ani = lottie.loadAnimation({
            loop: true,
            autoplay: true,
            // eslint-disable-next-line global-require
            animationData: require('@/static/icons8-'),
            rendererSettings: {
              context,
            },
          });
          this.inited = true;
        })
        .exec();
    },
    play() {
      ani.play();
    },
    pause() {
      ani.pause();
    },
  },
};
</script>

<style></style>
