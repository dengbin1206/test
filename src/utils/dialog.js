import Vue from 'vue'
// v-dialogDrag: 弹窗拖拽
Vue.directive('dialog', {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cssText += ';cursor:pointer;'
    dragDom.style.cssText += ';top:0px;'
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (function () {
      if (document.body.currentStyle) {
        // 在ie下兼容写法
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })()

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      const screenWidth = document.body.clientWidth // body当前宽度
      const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)

      const dragDomWidth = dragDom.offsetWidth // 对话框宽度
      const dragDomheight = dragDom.offsetHeight // 对话框高度

      const minDragDomLeft = dragDom.offsetLeft
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

      const minDragDomTop = dragDom.offsetTop
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight

      // 获取到的值带px 正则匹配替换
      let styL = sty(dragDom, 'left')
      // 为兼容ie　
      if (styL === 'auto') styL = '0px'
      let styT = sty(dragDom, 'top')

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100)
        styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
      } else {
        styL = +styL.replace(/px/g, '')
        styT = +styT.replace(/px/g, '')
      };

      document.onmousemove = function (e) {

        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX
        let top = e.clientY - disY
        // 边界处理
        if (-(left) > minDragDomLeft) {
          left = -(minDragDomLeft)
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft
        }

        if (-(top) > minDragDomTop) {
          top = -(minDragDomTop)
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`

      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
      return false
    }
  }
})

Vue.directive('dialogChange', {
  bind(el, binding, vnode, oldVnode) {





    const dragDom = el.querySelector('.el-dialog')

    let resize = document.createElement("div");
    dragDom.appendChild(resize);
    resize.style.cursor = 'se-resize';
    resize.style.position = 'absolute';
    resize.style.height = '10px';
    resize.style.width = '10px';
    resize.style.right = '0px';
    resize.style.bottom = '0px';

    resize.onmousedown = (e) => {


      // 记录初始x位置
      const clientX = e.clientX;
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - resize.offsetLeft;
      const disY = e.clientY - resize.offsetTop;

      let minWidth = 1400;
      let minHeight = 900;

      let maxWidth = document.documentElement.clientWidth

      document.onmousemove = function (e) {
        e.preventDefault(); // 移动时禁用默认事件

        console.table({
          '窗口大小:': maxWidth,
          'top:': resize.offsetTop,
          'left:': resize.offsetLeft
        })

        // 通过事件委托，计算移动的距离 
        const x = e.clientX - disX + (e.clientX - clientX);
        const y = e.clientY - disY;

        //比较是否小于最小宽高

        console.log(x,y);

        // if (x == maxWidth) {
        //   dragDom.style.width = maxWidth
        // } else {
        //   dragDom.style.width = x > minWidth ? `${x}px` : minWidth + 'px';
        //   dragDom.style.height = y > minHeight ? `${y}px` : minHeight + 'px';
        // }




      };
      //拉伸结束
      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };

      return false
    }
  }
})