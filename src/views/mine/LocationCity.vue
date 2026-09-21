<template>
  <div class="jd-style-address-picker">
    <!-- 顶部搜索栏 -->
    <div class="search-header">
      <div class="search-bar">
        <van-icon name="arrow-left" class="back-icon" @click="goBack" />
        <div class="search-input-wrapper">
          <van-icon name="search" class="search-icon" />
          <input type="text" v-model="searchKeyword" placeholder="请输入小区或写字楼" @focus="onSearchFocus"
            @input="handleSearchInput" class="search-input" />
          <van-icon v-if="searchKeyword" name="clear" class="clear-icon" @click="clearSearch" />
        </div>
        <div class="cancel-btn" @click="cancelSearch" v-if="isSearching">取消</div>
      </div>
    </div>

    <!-- 地图容器 -->
    <div id="container" ref="mapContainer" class="map-container"></div>

    <!-- 地址列表区域 -->
    <div class="address-list-container" :class="{ 'full-screen': isSearching }">
      <!-- 搜索结果列表 -->
      <div class="search-results" v-if="isSearching && searchKeyword">
        <div v-for="(result, index) in searchResults" :key="result.id || index" class="result-item"
          @click="selectSearchResult(result)">
          <div class="result-icon">
            <van-icon name="location" />
          </div>
          <div class="result-content">
            <div class="result-title">{{ result.title }}</div>
            <div class="result-address">{{ result.address }}</div>
            <div class="result-area">{{ result.province + result.city + result.district }}</div>
          </div>
        </div>

        <div v-if="searchResults.length === 0 && searchKeyword" class="no-results">
          <van-icon name="search" size="40" color="#ccc" />
          <div class="no-result-text">未找到相关地址</div>
        </div>
      </div>

      <!-- 附近地址列表 -->
      <div class="nearby-addresses" v-if="!isSearching">
        <div style="background-color: #fef5f0;font-size: 13px;padding:15px 15px;color: #953b22;">
        <img src="../../assets/dc2.png" style="width: 14px;" alt="">  为帮助骑手准确配送，请选择小区内更精准的楼栋，如1号楼
        </div>
        <div class="address-list" id="addrs">
          <div v-for="(address, index) in nearbyAddresses" :key="address.id || index" class="address-item" :class="{
            selected: selectedAddressId === address.id
          }" @click="selectAddress(address, index)">
            <div class="address-content">
              <div class="address-name">
              <img src="../../assets/dc.png" style="width: 12px;" alt="" />  {{ address.title || address.name }}
              </div>
              <div class="address-detail">
                <img src="../../assets/dc1.png" style="width: 12px;" alt="" /> {{ address.address || address.detail }}
              </div>
            </div>
            <van-icon v-if="selectedAddressId === address.id" name="success" color="#1989fa" />
          </div>
        </div>
      </div>


    </div>

    <!-- 确认按钮 -->
    <div class="confirm-footer" v-if="!isSearching">
      <van-button round type="primary" class="confirm-btn" @click="confirmSelection" :disabled="!selectedAddressId">
        确认地址
      </van-button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import wx from "weixin-js-sdk";
import { getLocations } from "@/api/city";

export default {
  name: 'JdStyleAddressPicker',
  data() {
    return {
      // 地图相关
      map: null,
      BMap: null,
      geocoder: null, rectangleOverlay: null, // 长方形覆盖物引用

      // 位置相关
      // const storedLng = sessionStorage.getItem("longitude");
      // const storedLat = sessionStorage.getItem("latitude");

      currentPosition: { lng: sessionStorage.getItem("longitude"), lat: sessionStorage.getItem("latitude") },
      selectedPosition: { lng: 0, lat: 0 },
      currentCity: '北京市',

      // 地址数据
      nearbyAddresses: [],
      selectedAddressId: null,
      selectedAddress: null,

      // 搜索相关
      searchKeyword: '',
      isSearching: false,
      searchResults: [],
      searchTimer: null,

      // 定位状态
      isLoading: false,

      // 默认地址（备用）
      defaultAddresses: [
        {
          id: '',
          title: '',
          address: '',
          province: '北京市',
          city: '北京市',
          district: '',
          point: { lng: sessionStorage.getItem("longitude"), lat: sessionStorage.getItem("latitude") }
        }
      ]
    }
  },

  mounted() {
    this.initMap()
  },

  methods: {
    //坐标转换
    bd09ToGcj02(lng, lat) {
      var x_pi = 3.14159265358979324 * 3000.0 / 180.0
      var x = lng - 0.0065
      var y = lat - 0.006
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
      var gg_lng = z * Math.cos(theta)
      var gg_lat = z * Math.sin(theta)
      return [gg_lng, gg_lat]
    },
    /**
     * 初始化地图
     */
    initMap() {
      // 检查是否在微信环境
      if (this.isWeiXin()) {
        // 微信环境使用微信定位
        this.initWechatLocation()
      } else {
        // 非微信环境直接加载地图
        this.loadBaiduMap()
      }
    },

    /**
     * 加载百度地图
     */
    loadBaiduMap() {
      // 检查是否已经加载
      if (window.BMap) {
        this.BMap = window.BMap
        this.setupMap()
        return
      }

      // 创建script标签加载百度地图API
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `//api.map.baidu.com/api?v=2.0&ak=b3nPqKCpAtoSG03oDXu2FjuIUFvWOn9C&callback=baiduMapCallback`




      // 定义回调函数
      window.baiduMapCallback = () => {
        this.BMap = window.BMap
        this.setupMap()
      }

      script.onerror = (error) => {
        console.error('百度地图API加载失败:', error)
        Toast.fail('地图加载失败，请检查网络')
        // 显示默认地址列表
        this.showDefaultAddresses()
      }

      document.head.appendChild(script)
    },

    /**
     * 设置地图
     */
    setupMap() {
      try {
        // 创建地图实例
        this.map = new this.BMap.Map('container')

        // 设置初始中心点
        const point = new this.BMap.Point(this.currentPosition.lng, this.currentPosition.lat)
        this.map.centerAndZoom(point, 15)

        // 启用交互功能
        this.map.enableScrollWheelZoom(true)
        this.map.enableDoubleClickZoom(true)

        // 初始化地理编码器
        this.geocoder = new this.BMap.Geocoder()

        // 添加中心点图标
        this.addCenterIcon()

        // 监听地图拖动结束事件
        this.map.addEventListener("dragend", this.handleMapDragEnd.bind(this))

        // 添加透明蓝色长方形覆盖物
        this.addRectangleOverlay()
        // 尝试定位
        this.tryLocation()

      } catch (error) {
        console.error('地图设置失败:', error)
        Toast.fail('地图初始化失败')
        this.showDefaultAddresses()
      }
    },
    /**
 * 添加长方形透明覆盖物
 */
    addRectangleOverlay() {
      if (!this.map || !this.BMap) return

      try {
        // 计算长方形区域（以中心点为中心，0.01经纬度范围）
        const center = new this.BMap.Point(this.currentPosition.lng, this.currentPosition.lat)
        const sw = new this.BMap.Point(
          this.currentPosition.lng - 0.005, // 向西偏移
          this.currentPosition.lat - 0.003  // 向南偏移
        )
        const ne = new this.BMap.Point(
          this.currentPosition.lng + 0.005, // 向东偏移
          this.currentPosition.lat + 0.003  // 向北偏移
        )

        // 创建长方形边界
        const bounds = new this.BMap.Bounds(sw, ne)

        // 创建多边形（长方形）覆盖物
        const rectangle = new this.BMap.Polygon([
          new this.BMap.Point(sw.lng, sw.lat), // 左下角
          new this.BMap.Point(ne.lng, sw.lat), // 右下角
          new this.BMap.Point(ne.lng, ne.lat), // 右上角
          new this.BMap.Point(sw.lng, ne.lat)  // 左上角
        ], {
          strokeColor: "#1989fa",     // 边框颜色
          strokeWeight: 2,            // 边框宽度
          strokeOpacity: 0.8,         // 边框透明度
          fillColor: "#1989fa",       // 填充颜色
          fillOpacity: 0.2            // 填充透明度（20%透明）
        })

        // 添加到地图
        this.map.addOverlay(rectangle)
        this.rectangleOverlay = rectangle // 保存引用，便于后续更新

      } catch (error) {
        console.error('添加覆盖物失败:', error)
      }
    },
    /**
     * 尝试定位
     */
    async tryLocation() {
      try {
        // 先显示默认地址
        this.showDefaultAddresses()

        // 尝试获取当前位置
        await this.getCurrentLocation()
      } catch (error) {
        console.warn('定位失败，使用默认位置:', error)
        this.reverseGeocode(this.currentPosition.lng, this.currentPosition.lat)
      }
    },

    /**
     * 初始化微信定位
     */
    async initWechatLocation() {
      try {
        Toast.loading({
          message: '定位中...',
          forbidClick: true,
          duration: 0
        })

        await this.getWechatLocation()

        Toast.clear()
        // 微信定位成功后加载地图
        this.loadBaiduMap()

      } catch (error) {
        console.error('微信定位失败:', error)
        Toast.clear()
        // 微信定位失败也加载地图，使用默认位置
        this.loadBaiduMap()
      }
    },

    /**
     * 获取当前位置
     */
    /**
* 获取当前位置
*/
    async getCurrentLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { longitude, latitude } = position.coords
              const [bdLng, bdLat] = this.wgs84ToBd09(longitude, latitude)
              this.currentPosition = { lng: bdLng, lat: bdLat }

              // 更新地图中心
              if (this.map) {
                const point = new this.BMap.Point(bdLng, bdLat)
                this.map.centerAndZoom(point, 15)

                // 更新长方形覆盖物位置
                this.updateRectanglePosition(bdLng, bdLat)
              }

              // 反向地理编码
              this.reverseGeocode(bdLng, bdLat)
              resolve()
            },
            (error) => {
              console.warn('浏览器定位失败:', error)
              // 定位失败，使用默认位置
              this.reverseGeocode(this.currentPosition.lng, this.currentPosition.lat)
              resolve()
            },
            {
              enableHighAccuracy: false, // 降低精度要求，提高成功率
              timeout: 5000,
              maximumAge: 300000
            }
          )
        } else {
          reject(new Error('浏览器不支持定位'))
        }
      })
    },

    /**
     * 微信定位
     */
    async getWechatLocation() {
      return new Promise((resolve, reject) => {
        const purl = window.location.href.split('#')[0]

        getLocations({ url: purl }).then(res => {
          if (res.code === 200) {
            const config = {
              debug: false,
              appId: res.data.appid,
              timestamp: res.data.time,
              nonceStr: res.data.nonceStr,
              signature: res.data.signature,
              jsApiList: ['getLocation']
            }

            wx.config(config)

            wx.ready(() => {
              wx.getLocation({
                type: 'gcj02',
                success: (result) => {
                  const [bdLng, bdLat] = this.gcj02ToBd09(result.longitude, result.latitude)
                  this.currentPosition = { lng: bdLng, lat: bdLat }
                  resolve()
                },
                fail: (err) => {
                  console.error('微信定位失败:', err)
                  reject(err)
                }
              })
            })

            wx.error((err) => {
              reject(err)
            })
          } else {
            reject(new Error('获取微信配置失败'))
          }
        }).catch(reject)
      })
    },

    /**
     * 添加中心点图标
     */
    addCenterIcon() {
      const mapContainer = document.getElementById('container')
      if (!mapContainer) return

      const icon = document.createElement('img')
      icon.src = require('@/assets/position1.png')
      icon.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -100%);
        z-index: 999;
        cursor: pointer;
        border-radius: 5px;
        width: 30px;
        height: 30px;
      `
      icon.id = "addrIcon"

      icon.onclick = (e) => {
        if (this.map) {
          this.map.setZoom(this.map.getZoom() + 2)
        }
      }

      mapContainer.appendChild(icon)
    },

    /**
     * 反向地理编码
     */
    reverseGeocode(lng, lat) {
      if (!this.geocoder) {
        // 如果地理编码器未初始化，显示默认地址
        this.showDefaultAddresses()
        return
      }

      const point = new this.BMap.Point(lng, lat)

      this.geocoder.getLocation(point, (rs) => {
        if (!rs) {
          this.showDefaultAddresses()
          return
        }

        const addComp = rs.addressComponents

        console.log('rs.addressComponents')
        console.log(rs.addressComponents)

        if (addComp.city) {
          // 移除城市名中的"市"字，符合百度地图API要求
          this.currentCity = addComp.city.replace('市', '')
        } else if (addComp.province) {
          // 如果城市为空，使用省份作为备选
          this.currentCity = addComp.province.replace('省', '')
        } else {
          // 如果都没有，使用默认城市
          this.currentCity = '北京'
        }



        // this.currentCity = addComp.city || '北京市'

        // 处理周边POI
        const surroundingArr = rs.surroundingPois || []
        const addresses = surroundingArr.map(item => ({
          id: `poi_${Date.now()}_${Math.random()}`,
          title: item.title,
          address: item.address,
          province: addComp.province,
          city: addComp.city,
          district: addComp.district,
          point: item.point
        }))

        // 添加当前位置
        addresses.push({
          id: 'current_location',
          title: rs.address || '当前位置',
          address: rs.address || '无法获取详细地址',
          province: addComp.province,
          city: addComp.city,
          district: addComp.district,
          point: rs.point
        })

        // 显示地址列表
        this.nearbyAddresses = addresses
        if (this.nearbyAddresses.length > 0) {
          this.selectAddress(this.nearbyAddresses[0], 0)
        }
      })
    },

    /**
     * 显示默认地址
     */
    showDefaultAddresses() {
      this.nearbyAddresses = this.defaultAddresses
      if (this.nearbyAddresses.length > 0) {
        this.selectAddress(this.nearbyAddresses[0], 0)
      }
    },

    /**
     * 处理地图拖动结束
     */

    /**
 * 处理地图拖动结束
 */
    handleMapDragEnd() {
      if (!this.map || !this.geocoder) return

      const center = this.map.getCenter()

      // 显示动画效果
      const icon = document.getElementById('addrIcon')
      if (icon) {
        icon.classList.add("icon")
        setTimeout(() => {
          icon.classList.remove("icon")
        }, 1000)
      }

      // 更新长方形覆盖物位置
      this.updateRectanglePosition(center.lng, center.lat)

      // 反向地理编码
      this.reverseGeocode(center.lng, center.lat)
    },

    /**
     * 更新长方形覆盖物位置
     */
    updateRectanglePosition(lng, lat) {
      if (!this.map || !this.BMap) return

      try {
        // 如果已有覆盖物，先移除
        if (this.rectangleOverlay) {
          this.map.removeOverlay(this.rectangleOverlay)
        }

        // 重新计算长方形区域
        const sw = new this.BMap.Point(
          lng - 0.005, // 向西偏移
          lat - 0.003  // 向南偏移
        )
        const ne = new this.BMap.Point(
          lng + 0.005, // 向东偏移
          lat + 0.003  // 向北偏移
        )

        // 创建新的长方形覆盖物
        const rectangle = new this.BMap.Polygon([
          new this.BMap.Point(sw.lng, sw.lat), // 左下角
          new this.BMap.Point(ne.lng, sw.lat), // 右下角
          new this.BMap.Point(ne.lng, ne.lat), // 右上角
          new this.BMap.Point(sw.lng, ne.lat)  // 左上角
        ], {
          strokeColor: "#1989fa",     // 边框颜色
          strokeWeight: 2,            // 边框宽度
          strokeOpacity: 0.8,         // 边框透明度
          fillColor: "#1989fa",       // 填充颜色
          fillOpacity: 0.2            // 填充透明度（20%透明）
        })

        // 添加到地图
        this.map.addOverlay(rectangle)
        this.rectangleOverlay = rectangle // 更新引用

      } catch (error) {
        console.error('更新覆盖物失败:', error)
      }
    },
    /**
     * 选择地址
     */
    selectAddress(address, index) {
      this.selectedAddressId = address.id
      this.selectedAddress = address

      if (address.point) {
        this.selectedPosition = {
          lng: address.point.lng,
          lat: address.point.lat
        }
      }

      // 更新UI
      const addressItems = document.querySelectorAll('.address-item')
      addressItems.forEach((item, i) => {
        if (i === index) {
          item.classList.add('selected')
        } else {
          item.classList.remove('selected')
        }
      })

      // 移动地图到选中的位置
      if (address.point && this.map) {
        const point = new this.BMap.Point(address.point.lng, address.point.lat)
        this.map.panTo(point)
        // 更新长方形覆盖物位置
        this.updateRectanglePosition(address.point.lng, address.point.lat)
      }
    },

    /**
     * 处理搜索输入
     */
    handleSearchInput() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }

      if (!this.searchKeyword.trim()) {
        this.searchResults = []
        return
      }

      this.searchTimer = setTimeout(() => {
        if (this.searchKeyword.length >= 2) {
          this.performSearch()
        }
      }, 500)
    },

    
    performSearch() {
      if (!this.BMap || !this.searchKeyword.trim() || !this.map) {
        console.warn('搜索条件不满足:', { BMap: !!this.BMap, keyword: this.searchKeyword, map: !!this.map })
        return
      }

      try {
        // 创建本地搜索实例 - 使用新版API
        const local = new this.BMap.LocalSearch(this.currentCity, {
          renderOptions: {
            // map: this.map,
            // autoViewport: true
            map: null, // 这里设置为null，不在搜索结果上显示标注
            autoViewport: true,
            selectFirstResult: false, // 不选中第一个结果
            panel: null // 不使用结果面板
          },
          pageCapacity: 20,
          onSearchComplete: (results) => {
            this.processSearchResults(results)
          }, onInfoHtmlSet: () => {
            // 这个方法什么都不做，阻止默认的信息窗口
            return false;
          }
        })

        // 检查search方法是否存在
        if (typeof local.search === 'function') {
          local.search(this.searchKeyword)
        } else if (typeof local.searchInCity === 'function') {
          local.searchInCity(this.searchKeyword, this.currentCity)
        } else {
          console.error('LocalSearch 对象没有 search 或 searchInCity 方法')
          Toast('搜索功能暂时不可用')
        }

      } catch (error) {
        console.error('搜索出错:', error)
        Toast('搜索失败，请重试')
      }
    },
    /**
     * 处理搜索结果
     */
    processSearchResults(results) {
      const searchResults = []

      if (results) {
        // 尝试获取POI数量
        const poiCount = results.getCurrentNumPois ? results.getCurrentNumPois() : 0

        for (let i = 0; i < poiCount; i++) {
          try {
            const poi = results.getPoi(i)
            if (poi && poi.point) {
              searchResults.push({
                id: poi.uid || `search_${Date.now()}_${i}`,
                title: poi.title || '',
                address: poi.address || '',
                province: poi.province || '',
                city: poi.city || '',
                district: poi.district || '',
                point: poi.point
              })
            }
          } catch (error) {
            console.error('处理POI失败:', error)
          }
        }
      }

      this.searchResults = searchResults
    },

    /**
     * 选择搜索结果
     */
    /**
* 选择搜索结果
*/
    selectSearchResult(result) {
      this.selectedAddressId = result.id
      this.selectedAddress = result

      if (result.point) {
        this.selectedPosition = {
          lng: result.point.lng,
          lat: result.point.lat
        }
      }

      // 移动地图
      if (this.map && result.point) {
        const point = new this.BMap.Point(result.point.lng, result.point.lat)
        this.map.centerAndZoom(point, 17)

        // 更新长方形覆盖物位置
        this.updateRectanglePosition(result.point.lng, result.point.lat)
      }

      // 退出搜索模式
      this.cancelSearch()

      // 将搜索结果添加到地址列表
      this.nearbyAddresses = [result, ...this.nearbyAddresses]
      this.selectAddress(result, 0)
    },

    /**
     * 搜索框获得焦点
     */
    onSearchFocus() {
      this.isSearching = true
    },

    /**
     * 取消搜索
     */
    cancelSearch() {
      this.isSearching = false
      this.searchKeyword = ''
      this.searchResults = []
    },

    /**
     * 清空搜索
     */
    clearSearch() {
      this.searchKeyword = ''
      this.searchResults = []
    },

    /**
     * 确认选择
     */
    confirmSelection() {
      if (!this.selectedAddress) {
        Toast('请先选择位置')
        return
      }
      console.log(this.selectedAddress)

      const bdLng = this.selectedAddress.point?.lng || this.selectedPosition.lng
      const bdLat = this.selectedAddress.point?.lat || this.selectedPosition.lat
      const [gcjLng, gcjLat] = this.bd09ToGcj02(bdLng, bdLat)

      // 构建完整的地址字符串（这是关键）
      const fullAddress = [
        // this.selectedAddress.province,
        // this.selectedAddress.city,
        this.selectedAddress.district,
        this.selectedAddress.title,
        this.selectedAddress.address
      ].filter(item => item && item.trim()).join('')





      // 保存地址信息到sessionStorage
      const addressInfo = {
        name: this.selectedAddress.title,
        address: this.selectedAddress.address,
        province: this.selectedAddress.province,
        city: this.selectedAddress.city,
        district: this.selectedAddress.district,
        // 关键：保存完整地址字符串
        fullAddress: fullAddress,
        // lng: this.selectedAddress.point?.lng || this.selectedPosition.lng,
        //   lat: this.selectedAddress.point?.lat || this.selectedPosition.lat,
        lng: gcjLng,  // ← 这里使用转换后的坐标
        lat: gcjLat   // ← 这里使用转换后的坐标
      }

      sessionStorage.setItem('selectedAddress', JSON.stringify(addressInfo))

      Toast.success('位置已选择')

      // 返回上一页
      setTimeout(() => {
        this.$router.back()
      }, 800)
    },
    /**
     * 返回
     */
    goBack() {
      this.$router.back()
    },

    /**
     * 检查是否在微信中
     */
    isWeiXin() {
      const ua = navigator.userAgent.toLowerCase()
      return ua.includes('micromessenger')
    },

    /**
     * 坐标转换方法
     */
    wgs84ToBd09(lng, lat) {
      const x_pi = (3.14159265358979324 * 3000.0) / 180.0
      const x = lng
      const y = lat
      const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
      const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
      const bd_lng = z * Math.cos(theta) + 0.0065
      const bd_lat = z * Math.sin(theta) + 0.006
      return [bd_lng, bd_lat]
    },

    gcj02ToBd09(lng, lat) {
      const x_pi = (3.14159265358979324 * 3000.0) / 180.0
      const x = lng
      const y = lat
      const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
      const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
      const bd_lng = z * Math.cos(theta) + 0.0065
      const bd_lat = z * Math.sin(theta) + 0.006
      return [bd_lng, bd_lat]
    }
  }
}
</script>

<style lang="less" scoped>
.jd-style-address-picker {
  position: fixed;
  /* 关键：脱离文档流，防止与父页面互相影响 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  /* 添加以下两行，增强隔离和性能 */
  // overflow: hidden; /* 禁止此容器自身产生任何滚动 */
  z-index: 1000;
  /* 确保在最顶层 */

  .search-header {
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;

    .search-bar {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      gap: 10px;

      .back-icon {
        font-size: 20px;
        color: #333;
        flex-shrink: 0;
        cursor: pointer;
      }

      .search-input-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        background: #f5f5f5;
        border-radius: 20px;
        padding: 8px 15px;


        .search-icon {
          color: #999;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 14px;
          color: #333;
          outline: none;

          &::placeholder {
            color: #999;
          }
        }

        .clear-icon {
          color: #ccc;
          margin-left: 8px;
          flex-shrink: 0;
          cursor: pointer;
        }
      }

      .cancel-btn {
        color: #1989fa;
        font-size: 14px;
        flex-shrink: 0;
        cursor: pointer;
      }
    }
  }

  .map-container {
    width: 100%;
    height: 52%;
    /* 保持原有比例 */
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
    /* 关键：明确地图的触摸行为，只允许平移和缩放 */
    touch-action: pan-x pan-y pinch-zoom;
  }

  .address-list-container {
    flex: 1;
    display: flex;
    /* 新增 */
    flex-direction: column;
    /* 新增 */
    min-height: 0;
    overflow: hidden;
    background: #f9fafa;
    border-radius: 30px 30px 0 0;
    margin-top: -120px;
    position: relative;
    z-index: 999;

    &.full-screen {
      margin-top: -150px;
      border-radius: 0;
    }

    .nearby-addresses {
       box-shadow: 0 2px 10px rgba(0, 0, 0, 0.8); 
      position: absolute;
      /* 新增 */
      top: 0;
      /* 新增 */
      left: 0;
      /* 新增 */
      right: 0;
      /* 新增 */
      bottom: 0;
      /* 新增 */
      overflow: hidden;
      /* 保留但位置变化 */
      display: flex;
      /* 新增 */
      flex-direction: column;

      .address-list {
        // height: 100%;
        overflow-y: auto;
        padding-bottom: 60px;
        border-radius: 20px;
        flex: 1;
        /* 新增 - 关键！ */
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;

        /* 新增 - 移动端优化 */
        .address-item {
          display: flex;
          align-items: center;
          padding: 15px;
          // margin: 0 10px;
          border-bottom: #e2e2e2 solid 1px;
          background: #FFF;
          cursor: pointer;

          &:first-child {
            // margin-top: 20px;
          }

          &:active {
            background: #f9f9f9;
          }

          &.selected {
            background: #f0f8ff;
          }

          .address-content {
            flex: 1;
            width: 88%;

            .address-name {
              font-size: 16px;
              color: #333;
              font-weight: 500;
              margin-bottom: 4px;
            }

            .address-detail {
              font-size: 12px;
              color: #666;
              font-weight: 200;
            }
          }
        }
      }
    }

    .search-results {
      height: 100%;
      background: white;
      overflow-y: auto;
      padding: 20px 0;

      .result-item {
        display: flex;
        align-items: flex-start;
        padding: 15px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;

        &:active {
          background: #f9f9f9;
        }

        .result-icon {
          color: #1989fa;
          margin-right: 12px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .result-content {
          flex: 1;

          .result-title {
            font-size: 16px;
            color: #333;
            font-weight: 500;
            margin-bottom: 4px;
          }

          .result-address {
            font-size: 14px;
            color: #666;
            margin-bottom: 2px;
          }

          .result-area {
            font-size: 12px;
            color: #999;
          }
        }
      }

      .no-results {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        color: #999;

        .no-result-text {
          margin-top: 15px;
          font-size: 14px;
        }
      }
    }
  }

  .confirm-footer {
    position: fixed;
    bottom: 10px;
    left: 0;
    right: 0;
    text-align: center;
    background: #f9fafa;
    padding: 10px;
    z-index: 1000;

    .confirm-btn {
      width: 98%;
      background: #df5655;
      color: #fff;
      border: none;
      height: 44px;
      font-size: 16px;

      &:disabled {
        opacity: 0.6;
      }
    }
  }
}

@keyframes iconChecked {
  from {
    padding-bottom: 15px;
  }

  to {
    padding-bottom: 0;
  }
}

.icon {
  animation-name: iconChecked;
  animation-duration: 0.6s;
}
</style>