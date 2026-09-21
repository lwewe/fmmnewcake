<template>
  <div class="location" @click="closeAll">
    <NProgress v-if="loadingflag" />
    <!--    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>-->
    <!--    地址 v-if="radio==2"-->
    <div class="addressBox">
      <div class="address" @click="changeAdress">
        <div v-if="!addrShow" style="font-size: 14px">您还没有配送地址，去新建一个</div>
        <div class="leftBox" v-else>
          <div class="addressIcon">
            <img class="img" src="../../assets/tubiao/dd.png" alt="">
          </div>
          <div>
            <div class="addressDetail">
              {{ addrShow.province }}{{ addrShow.city }}{{ addrShow.area }}{{ addrShow.addr }}
            </div>
          </div>
        </div>
        <div>
          <van-icon color="#CBCBCB" name="arrow" />
        </div>
      </div>
      <div>
        <!--        :style="{border:radio==1? 'none':'',paddingTop:radio==1? '0':'',marginTop:radio==1? '0':''}"-->
        <div class="phoneBox phoneBox1">
          <div class="phoneNumber">
            <div class="phoneTitle">手机号</div>
            <div class="phoneInp"><input @input="changeinput" v-model="phoneNumber" :disabled="disabled"
                placeholder="请填写订货人手机号" type="text" name="" id=""></div>
          </div>
          <div class="with">
            <div class="withText">同收货人</div>
            <div class="withIcon">
              <van-checkbox @change="changeCheckbox" checked-color="#ee0a24" v-model="withChecked"></van-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-for="(item, index) in orderList" :key="item.id">
      <!--    商品信息-->
      <div class="addressBox addressBox2">
        <div class="itemTitle">商品信息</div>
        <div class="shopInfo">
          <div class="shopImg">
            <img style="border-radius: 5px;" class="img"
              :src="item.cpbs == 1 ? item.product.thumbnailimage : item.product.image_path" alt="">
          </div>
          <div class="nameBox">
            <div class="shopName">{{ item.cpbs == 1 ? item.product.name : item.product.title }}</div>
            <div class="can">{{ item.cpbs == 1 ? item.xinghao.xinghao : item.xinghao.name }}</div>
            <div class="all">
              <div class="price">￥{{ item.xinghao.price }}</div>
              <div class="number">×{{ item.quantity }}</div>
            </div>
          </div>
        </div>
      </div>
      <!--    手机号-->
      <div class="addressBox addressBox2" style="padding-top: 0px;padding-bottom: 2px" v-if="item.cpbs == 2">
        <!--      手机号-->
        <div class="phoneBox"
          :style="{ border: item.product.flag == 1 ? item.product.delivery == 0 : (item.radio == '' || item.product.peisong == '' || !item.product.peisong || item.product.peisong.is_distribution == 0) ? 'none' : '' }">
          <div class="phoneNumber" style="width: 20%;">
            <div class="phoneTitle">配送方式</div>
          </div>
          <div class="with" style="width: 80%;">
            <div class="withText" style="color: #F34F4E"
              v-if="item.product.flag == 1 ? item.product.delivery == 0 : (item.radio == '' || item.product.peisong == '' || !item.product.peisong || item.product.peisong.is_distribution == 0)">
              该地址不支持配送,请切换地址
            </div>
            <!--            {{item.radio}}-->
            <div v-else>
              <van-radio-group v-model="item.radio" class="radioBox" @change="changeRadio(item.radio, index, item)"
                v-if="item.product.peisong && item.product.flag != 1">
                <van-radio label-position="left" checked-color="#ee0a24" name="1"
                  v-if="item.product.peisong.can_take == 1">
                  门店自取
                </van-radio>
                <van-radio label-position="left" checked-color="#ee0a24" name="2"
                  v-if="item.product.peisong.can_ship == 1">
                  送货上门
                </van-radio>
                <van-radio label-position="left" checked-color="#ee0a24" name="3"
                  v-if="item.product.peisong.can_same == 1">
                  快递配送
                </van-radio>
              </van-radio-group>
              <div v-else>
                送货上门
              </div>
            </div>
          </div>
        </div>
        <!--      <div class="phoneBox">-->
        <!--        <div class="phoneTitle">配送时间</div>-->
        <!--        <div class="with" style="width: 76%;font-size: 10px;color:#8F8F8F">下单后48小时发货，请耐心等候</div>-->
        <!--      </div>-->
        <div
          v-if="item.product.flag == 1 ? item.product.delivery == 1 : (item.radio != '' && item.product.peisong != '' && item.product.peisong && item.product.peisong.is_distribution == 1)">
          <div v-if="item.product.flag == 1">
            <div class="phoneBox">
              <div class="phoneTitle">配送日期</div>
              <div class="with with2">
                <div v-if="!item.date" @click.stop="item.showDate = !item.showDate">请选择配送日期</div>
                <div v-else @click.stop="item.showDate = !item.showDate">{{ item.date }}</div>
                <!--    日期-->
                <div class="popup1">
                  <van-popup v-model="item.showDate" position="top">
                    <div class="popup" style="border: 1px solid #EAEAEA">
                      <div class="select">请选择配送日期</div>
                      <div>
                        <div class="synthesisItem" v-for="item2 in daysList" :key="item2.date"
                          @click="changeSynthesis(item2.date, item, item2, index)">
                          <div :class="{ addRegion: item.date == item2.date }" @click="item.showDate = false">
                            {{ item2.date }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </van-popup>
                </div>
                <!--            日期end-->
                <div style="padding-top:4px">
                  <van-icon name="arrow" />
                </div>
              </div>
            </div>
            <div class="phoneBox" :style="{ border: item.radio == 1 ? 'none' : '' }">
              <div class="phoneTitle">配送时间</div>
              <div class="with with2">
                <div v-if="!item.time" @click.stop="item.showTime = !item.showTime">
                  请选择配送时间
                </div>
                <div v-else @click.stop="item.showTime = !item.showTime">{{ item.time }}</div>
                <!--    时间-->
                <div class="popup1">
                  <van-popup v-model="item.showTime" position="top">
                    <div class="popup" style="border: 1px solid #EAEAEA">
                      <div class="select">
                        {{ item.date == "" ? '请先选择日期' : item.radio == 2 ? '请选择配送时间' : '请选择自取时间' }}
                      </div>
                      <!--                  配送时间-->
                      <div v-if="item.date">
                        <div class="synthesisItem" v-for="item2 in getTimeListByBrand(item.product.brand_id, item)"
                          :key="item2" @click="changeTime(item2, item, index)">
                          <div :class="{ addRegion: item.time == item2 }" @click="item.showTime = false">{{ item2 }}
                          </div>
                        </div>
                      </div>
                      <!--                  自取时间-->
                      <div v-if="item.date && item.radio == 1">
                        <div class="synthesisItem"
                          v-for="item2 in item.product.peisong.validate_take_dates.filter(item3 => item3.date == item.date)[0].validate_take_times"
                          :key="item2" @click="changeTime(item2, item, index)">
                          <div :class="{ addRegion: item.time == item2 }" @click="item.showTime = false">{{ item2 }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </van-popup>
                </div>
                <!--            时间end-->
                <div style="padding-top:4px">
                  <van-icon name="arrow" />
                </div>
              </div>
            </div>
            <!-- 供应商 -->
            <div class="phoneBox" style="border: none">
              <div class="phoneTitle">配送费</div>
              <div class="with" v-if="item.date && item.radio == 2">
                <div class="withText" style="color:#CC4A49;font-size: 14px">
                  ￥{{ item.deliveryCharge ? item.deliveryCharge  : 0}}
                </div>
              </div>
              <div class="with" v-else>
                <div class="withText" style="color:#CC4A49;font-size: 14px">￥0</div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="phoneBox" v-if="item.radio == 1 && item.product.peisong">
              <div class="phoneTitle">自取门店</div>
              <div class="with with2">
                <div @click="chooseStore(item.pinpai.brand_id, index)" v-if="!item.storeName">请选择自取门店</div>
                <div @click="chooseStore(item.pinpai.brand_id, index)" v-else>{{ item.storeName }}</div>
                <div style="padding-top:4px">
                  <van-icon name="arrow" />
                </div>
              </div>
            </div>

            <div class="phoneBox" v-if="(item.radio == 1 || item.radio == 2) && item.product.peisong">
              <div class="phoneTitle">{{ item.radio == 2 ? '配送日期' : '自取日期' }}</div>
              <div class="with with2">
                <div v-if="!item.date" @click.stop="item.showDate = !item.showDate">请选择{{
                  item.radio == 2 ? '配送日期' : '自取日期'
                }}
                </div>
                <div v-else @click.stop="item.showDate = !item.showDate">{{ item.date }}</div>
                <!--    日期-->
                <div class="popup1">
                  <van-popup v-model="item.showDate" position="top">
                    <div class="popup" style="border: 1px solid #EAEAEA">
                      <div class="select">请选择{{ item.radio == 2 ? '配送日期' : '自取日期' }}</div>
                      <div v-if="item.product.peisong && item.radio == 2">
                        <div class="synthesisItem" v-for="item2 in item.product.peisong.validate_delivery_dates"
                          :key="item2.date" @click="changeSynthesis(item2.date, item, item2, index)">
                          <div :class="{ addRegion: item.date == item2.date }" @click="item.showDate = false">
                            {{ item2.date }}
                          </div>
                        </div>
                      </div>
                      <div v-if="item.product.peisong && item.radio == 1">
                        <div class="synthesisItem" v-for="item2 in item.product.peisong.validate_take_dates"
                          :key="item2.date" @click="changeSynthesis(item2.date, item, index)">
                          <div :class="{ addRegion: item.date == item2.date }" @click="item.showDate = false">
                            {{ item2.date }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </van-popup>
                </div>
                <!--            日期end-->
                <div style="padding-top:4px">
                  <van-icon name="arrow" />
                </div>
              </div>
            </div>
            <div class="phoneBox" :style="{ border: item.radio == 1 ? 'none' : '' }"
              v-if="(item.radio == 1 || item.radio == 2) && item.product.peisong">
              <div class="phoneTitle">{{ item.radio == 2 ? '配送时间' : '自取时间' }}</div>
              <div class="with with2">
                <div v-if="!item.time" @click.stop="item.showTime = !item.showTime">
                  请选择{{ item.radio == 2 ? '配送时间' : '自取时间' }}
                </div>
                <div v-else @click.stop="item.showTime = !item.showTime">{{ item.time }}</div>
                <!--    时间-->
                <div class="popup1">
                  <van-popup v-model="item.showTime" position="top">
                    <div class="popup" style="border: 1px solid #EAEAEA">
                      <div class="select">
                        {{ item.date == "" ? '请先选择日期' : item.radio == 2 ? '请选择配送时间' : '请选择自取时间' }}
                      </div>
                      <!--                  配送时间-->
                      <div v-if="item.date && item.radio == 2">
                        <div class="synthesisItem"
                          v-for="item2 in item.product.peisong.validate_delivery_dates.filter(item3 => item3.date == item.date)[0].validate_delivery_times"
                          :key="item2" @click="changeTime(item2, item, index)">
                          <div :class="{ addRegion: item.time == item2 }" @click="item.showTime = false">{{ item2 }}
                          </div>
                        </div>
                      </div>
                      <!--                  自取时间-->
                      <div v-if="item.date && item.radio == 1">
                        <div class="synthesisItem"
                          v-for="item2 in item.product.peisong.validate_take_dates.filter(item3 => item3.date == item.date)[0].validate_take_times"
                          :key="item2" @click="changeTime(item2, item, index)">
                          <div :class="{ addRegion: item.time == item2 }" @click="item.showTime = false">{{ item2 }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </van-popup>
                </div>
                <!--            时间end-->
                <div style="padding-top:4px">
                  <van-icon name="arrow" />
                </div>
              </div>
            </div>
            <!-- dangaoshushu -->
            <div class="phoneBox" style="border: none" v-if="item.radio == 2 && item.product.peisong">
              <div class="phoneTitle">配送费</div>
              <div class="with" v-if="item.date && item.radio == 2">
                <div class="withText" style="color:#CC4A49;font-size: 14px">
                  ￥{{ item.deliveryCharge }}
                </div>
              </div>
              <div class="with" v-else>
                <div class="withText" style="color:#CC4A49;font-size: 14px">￥0</div>
              </div>
            </div>
            <div class="phoneBox" style="border: none" v-if="item.radio == 3 && item.product.peisong">
              <div class="phoneTitle">配送时间</div>
              <div class="with" style="width: 70%;" v-if="item.product.peisong">
                <div class="withText">{{ item.product.peisong.delivery_text }}</div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <!--    备注-->
      <div class="addressBox addressBox2">
        <div class="itemTitle" v-if="item.cpbs == 2">祝福语</div>
        <div class="textarea" v-if="item.cpbs == 2 && item.product">
          <textarea
            :maxlength="item.product.brand_id == '633' ? 6 : item.product.brand_id == '637' ? 9 : item.product.brand_id == '622' || item.product.brand_id == '636' ? 8 : item.product.brand_id == '624' ? 14 : 30"
            type="text" @input="changeGreeting(item, index)" v-model="item.greeting" class="img"
            placeholder="有什么想对商家说的可以在这里说哦~"></textarea>
        </div>
        <div class="itemTitle" :style="{ marginTop: item.cpbs == 2 ? '13px' : '' }">备注</div>
        <div class="textarea">
          <textarea type="text" @input="changeRemark(item, index)" v-model="item.remark" class="img"
            placeholder="有什么想对商家说的可以在这里说哦~"></textarea>
        </div>
      </div>
      <!--    订单明细-->
      <div class="addressBox addressBox2">
        <div class="itemTitle">小计</div>
        <div class="orderInfo">
          <div class="shopPrice">
            <div class="shopPriceText">商品金额</div>
            <div class="price">￥{{ (item.xinghao.price * item.quantity).toFixed(2) }}</div>
          </div>
          <div class="shopPrice">
            <div class="shopPriceText">配送费</div>
            <div class="price" v-if="item.date && item.radio == 2">￥{{ item.deliveryCharge }}
            </div>
            <div class="price" v-else>￥0</div>
          </div>
          <div class="shopPrice">
            <div class="shopPriceText">合计</div>
            <div class="price price1" v-if="item.radio == 2">
              ￥{{ (item.xinghao.price * item.quantity + Number(item.deliveryCharge)).toFixed(2) }}
            </div>
            <div class="price price1" v-else>￥{{ (item.xinghao.price * item.quantity).toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--    支付方式-->
    <div class="addressBox addressBox2 addressBox3">
      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>
    </div>
    <!--    支付按钮-->
    <div class="footer">
      <div class="allNumber">共{{ orderList.length }}件</div>
      <div class="rightBox">
        <div>
          <div class="all">合计:
            <span class="price">{{ changePrice1(paytotal) }}</span>
            <span class="priceNum">.{{ changePrice2(paytotal) }}</span>
          </div>
        </div>
        <div class="toPay" @click="toPay">去支付</div>
      </div>
    </div>
    <div class="loadingBox" v-if="isLoading">
      <loading :loadingText="0"></loading>
    </div>
    <!--    支付密码-->
    <PayPassword :isShow="isShow" @input="input" @onInput="onInput"></PayPassword>
  </div>
</template>
<script>
import Payment from "@/components/Payment.vue";
import PayPassword from "@/components/PayPassword.vue";
import { cakeFlkpay, cakeIsPayDate, cakeIsPaySuccess, cakewxpay, getflkList, toCheckout } from "@/api/account";
import moment from 'moment';
import 'moment/locale/zh-cn';

export default {
  name: "ConfirmOrder",
  components: { PayPassword, Payment },
  data() {
    return {
      cardList: [],
      orderList: [],
      addrShow: {},
      total: 0,
      result: [],
      // 支付方式选中
      checked: "",
      isShow: false,
      dataDetail: {},
      code: "",
      dkprice: "",
      wxprice: "",
      ka_ids: [],
      pass: "",
      act: "",
      otherData: {},
      openid: "",
      loadingflag: true,
      isLoading: false,
      withChecked: false,
      HomeDelivery: true,
      type: "",
      valueNumber: "",
      radio: "2",
      showDate: false,
      showTime: false,
      synthesisId: "",
      timeId: "",
      date: "",
      time: "",
      phoneNumber: "",
      disabled: false,
      dataList: [],
      radioList: [],
      dateList: [],
      paytotal: "",
      isBuy: false,
      code2: "",
      greetingList: [],
      deliveryChargeList: [],
      daysList: [],
      timeList: [
        '10:00-12:00',
        '12:00-14:00',
        '14:00-16:00',
        '16:00-18:00',
        '18:00-20:00',
      ],
      // 21cake专用时间段
      timeList21cake: [
        '10:00-13:00',
        '13:00-17:00',
        '17:00-20:00',
      ],
      timeListmcake: [
        '10:00-12:00',
        '12:00-14:00',
        '14:00-16:00',
        '16:00-18:00',
        '18:00-20:00',
      ],
      // brand_id 624和635专用时间段
      timeList624635: [
        '9:00-11:00',
        '11:00-13:00',
        '13:00-15:00',
        '15:00-17:00',
        '17:00-19:00',
        '19:00-21:00',
      ]
    }
  },
  methods: {
    // 根据品牌ID获取配送时间段
    // 根据品牌ID获取配送时间段
    getTimeListByBrand(brandId, item) {
      // 21cake品牌ID是633，使用专用时间段
      if (brandId && this.is21cakeBrand(brandId)) {
        const now = new Date();
        const currentHour = now.getHours();

        // 如果当前时间超过20点
        if (currentHour >= 20) {
          // 检查用户选择的配送日期
          if (item && item.date) {
            // 检查选择的日期是否是明天
            if (this.isTomorrowDate(item.date)) {
              // 如果是明天，过滤掉14点之前的时间段

              return this.filter21cakeTimeSlots();
            }
            // 如果是后天或以后，显示所有时间段

            return this.timeList21cake;
          }


          return this.filter21cakeTimeSlots();
        }

        // 20点之前下单，所有时间段都可用

        return this.timeList21cake;
      }

      // 637品牌逻辑 - 同样处理
      if (brandId && this.mcakeBrand(brandId)) {
        const now = new Date();
        const currentHour = now.getHours();

        if (currentHour >= 20) {
          if (item && item.date) {
            if (this.isTomorrowDate(item.date)) {
              ;
              return this.mcakeTimeSlots();
            }

            return this.timeListmcake;
          }

          return this.mcakeTimeSlots();
        }


        return this.timeListmcake;
      }

      // brand_id 624和635使用专用时间段
      if (brandId && this.isBrand624635(brandId)) {
        return this.timeList624635;
      }
      return this.timeList;
    },

    // 判断选择的日期是否是明天
    isTomorrowDate(selectedDateStr) {
      if (!selectedDateStr) return false;

      const now = new Date();
      const selectedDate = new Date(selectedDateStr);
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);

      // 比较年月日是否相同
      return (
        selectedDate.getFullYear() === tomorrow.getFullYear() &&
        selectedDate.getMonth() === tomorrow.getMonth() &&
        selectedDate.getDate() === tomorrow.getDate()
      );
    },

    // 过滤21cake时间段 - 只过滤14点之前的时间段
    filter21cakeTimeSlots() {
      return this.timeList21cake.filter(timeSlot => {
        // 21cake: 10:00-13:00和13:00-17:00都在14点之前
        if (timeSlot === '10:00-13:00' || timeSlot === '13:00-17:00') {
          return false;
        }
        return true; // 保留17:00-20:00
      });
    },

    // 过滤637品牌时间段 - 只过滤14点之前的时间段
    mcakeTimeSlots() {
      return this.timeListmcake.filter(timeSlot => {
        // 637: 10:00-12:00和12:00-14:00在14点之前或正好14点
        if (timeSlot === '10:00-12:00' || timeSlot === '12:00-14:00') {
          return false;
        }
        return true; // 保留14:00-16:00, 16:00-18:00, 18:00-20:00
      });
    },
    // 根据品牌ID获取配送时间段
    // getTimeListByBrand(brandId) {
    //   // 21cake品牌ID是633，使用专用时间段
    //   // if (brandId && this.is21cakeBrand(brandId)) {
    //   //   return this.timeList21cake;
    //   // }

    //   if (brandId && this.is21cakeBrand(brandId)) {
    //     const now = new Date();
    //     const currentHour = now.getHours();
    //     // return this.timeList21cake;
    //     if (currentHour >= 20) {
    //       return this.filter21cakeTimeSlots();
    //     }
    //     return this.timeList21cake;
    //   }

    //   if (brandId && this.mcakeBrand(brandId)) {
    //     const now = new Date();
    //     const currentHour = now.getHours();

    //     if (currentHour >= 20) {
    //       return this.mcakeTimeSlots();
    //     }
    //     return this.timeListmcake;
    //   }


    //   // brand_id 624和635使用专用时间段
    //   if (brandId && this.isBrand624635(brandId)) {
    //     return this.timeList624635;
    //   }
    //   return this.timeList;
    // },
    // 判断是否为637品牌
    mcakeBrand(brandId) {
      // 品牌ID是633
      const mBrandIds = ['637']; // 21cake的实际品牌ID
      return mBrandIds.includes(brandId.toString());
    },
    // filter21cakeTimeSlots() {
    //   // 21cake的时间段：10:00-13:00, 13:00-17:00, 17:00-20:00
    //   // 20点后下单，不能选择10:00-13:00和13:00-17:00（因为这两个都在14点之前/包含14点之前）
    //   // 只能选择17:00-20:00这个时间段
    //   return this.timeList21cake.filter(timeSlot => {
    //     // 检查时间段是否包含14点之前的部分
    //     if (timeSlot === '10:00-13:00' || timeSlot === '13:00-17:00') {
    //       return false; // 排除这两个时间段
    //     }
    //     return true; // 保留17:00-20:00
    //   });
    // },

    // mcakeTimeSlots() {
    //   // 21cake的时间段：10:00-13:00, 13:00-17:00, 17:00-20:00
    //   // 20点后下单，不能选择10:00-13:00和13:00-17:00（因为这两个都在14点之前/包含14点之前）
    //   // 只能选择17:00-20:00这个时间段
    //   return this.timeListmcake.filter(timeSlot => {
    //     // 检查时间段是否包含14点之前的部分
    //     if (timeSlot === '10:00-12:00' || timeSlot === '12:00-14:00') {
    //       return false; // 排除这两个时间段
    //     }
    //     return true; // 保留17:00-20:00
    //   });
    // },

    // 判断是否为21cake品牌
    is21cakeBrand(brandId) {
      // 21cake的品牌ID是633
      const cake21BrandIds = ['633']; // 21cake的实际品牌ID
      return cake21BrandIds.includes(brandId.toString());
    },
    // 判断是否为brand_id 624或635的品牌
    isBrand624635(brandId) {
      const brand624635Ids = ['624', '635']; // brand_id 624和635
      return brand624635Ids.includes(brandId.toString());
    },
    // generateDaysList(numDays) {
    //   const today = new Date();
    //   for (let i = 1; i < numDays; i++) {
    //     const date = new Date(today);
    //     date.setDate(today.getDate() + i);
    //     this.daysList.push({ date: moment(date).format('yyyy-MM-DD'), });
    //   }
    // },
    // 判断订单中是否包含624或635品牌
    has624635Brand() {
      return this.orderList.some(item =>
        item.cpbs == 2 && item.product && this.isBrand624635(item.product.brand_id)
      );
    },
    generateDaysList(numDays) {
      const today = new Date();
      const currentHour = today.getHours();

      // 关键：624品牌晚上9点后，从后天开始生成（i从2开始）
      const startDay = (this.has624635Brand() && currentHour >= 21) ? 2 : 1;
// 调试日志
  
      this.daysList = []; // 记得先清空
      for (let i = startDay; i < numDays; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        this.daysList.push({
          date: moment(date).format('yyyy-MM-DD'),
        });
      }
    },
    changeGreeting(item, index) {
      this.greetingList = this.greetingList.filter(item => item.indexs != index)
      this.greetingList.push({
        greeting: item.greeting,
        remark: item.remark,
        indexs: index
      })
      sessionStorage.setItem("greetingList", JSON.stringify(this.greetingList))
    },
    changeRemark(item, index) {
      this.greetingList = this.greetingList.filter(item => item.indexs != index)
      this.greetingList.push({
        greeting: item.greeting,
        remark: item.remark,
        indexs: index
      })
      sessionStorage.setItem("greetingList", JSON.stringify(this.greetingList))
    },
    closeAll() {
      this.orderList.forEach(item => {
        item.showDate = false
        item.showTime = false
        this.synthesisId = ""
        this.timeId = ""
      })
    },
    changeinput(e) {
      sessionStorage.setItem("phoneNum", e.target.value)
    },
    changeCheckbox(e) {
      // console.log(e)
      sessionStorage.setItem("isPhone", e)
      if (e) {
        this.phoneNumber = this.addrShow.phone
        this.disabled = true
      } else {
        this.phoneNumber = sessionStorage.getItem("phoneNum")
        this.disabled = false
      }
    },
    chooseStore(id, index) {
      this.$router.push({ path: "/allStore", query: { id, index } })
    },
    changeRadio(radio, index, item) {
      this.radio = radio
      this.synthesisId = ""
      this.timeId = ""
      item.time = ""
      item.date = ""
      item.deliveryCharge = 0
      this.paytotal = this.total
      this.deliveryChargeList = this.deliveryChargeList.filter(item => item.indexs != index)
      sessionStorage.setItem("deliveryChargeList", JSON.stringify(this.deliveryChargeList))
      this.dateList = this.dateList.filter(item => item.indexs != index)
      sessionStorage.setItem("dateList", JSON.stringify(this.dateList))
      if (this.deliveryChargeList.length > 0) {
        this.deliveryChargeList.forEach(item => {
          this.orderList.forEach((item2, index) => {
            if (item.indexs == index) {
              item2.deliveryCharge = item.deliveryCharge
              this.paytotal = (Number(this.paytotal) + Number(item.deliveryCharge)).toFixed(2)
            }
          })
        })
      }
      if (radio == 2) {
        item.storeName = ""
        this.dataList = this.dataList.filter(item => item.indexs != index)
        sessionStorage.setItem("StoreName", JSON.stringify(this.dataList))
      }
      this.radioList = this.radioList.filter(item => item.indexs != index)
      this.radioList.push({
        radio,
        indexs: index
      })
      sessionStorage.setItem("radio", JSON.stringify(this.radioList))
    },
    closePopup() {
      this.showDate = false
      this.showTime = false
    },
    changeSynthesis(id, item, item2, index) {
      this.synthesisId = id
      item.date = id
      this.timeId = ""
      item.time = ""
      item.deliveryCharge = item2.delivery_amount
      // item.deliveryCharge = 1
      if (item.radio != 2) {
        this.deliveryChargeList = this.deliveryChargeList.filter(item => item.indexs != index)
        this.paytotal = this.paytotal
      }
      if (item2 && item.radio == 2) {
        this.paytotal = (Number(this.paytotal) + Number(item.deliveryCharge ? item.deliveryCharge : 0)).toFixed(2)
        // console.log(this.paytotal)
      }
      this.deliveryChargeList = this.deliveryChargeList.filter(item => item.indexs != index)
      this.deliveryChargeList.push({
        deliveryCharge: item.deliveryCharge,
        indexs: index
      })
      sessionStorage.setItem("deliveryChargeList", JSON.stringify(this.deliveryChargeList))
    },
    changeTime(id, item, index) {
      this.timeId = id
      item.time = id
      this.dateList = this.dateList.filter(item => item.indexs != index)
      this.dateList.push({
        date: item.date,
        time: item.time,
        indexs: index
      })
      sessionStorage.setItem("dateList", JSON.stringify(this.dateList))
    },
    getIsCard() {
      this.act = ""
      this.otherData = {}
      let dataObj = {}
      this.orderList.forEach((item, index) => {
        const regex = /[^\u4e00-\u9fa5a-zA-Z0-9]+/g; // 正则表达式匹配特殊字符
        item.greeting = item.greeting.replace(regex, '')
        item.remark = item.remark.replace(regex, '')
        if (item.cpbs == 2) {
          if (item.flag == 1) {
            var xobj = {
              "ship_date": item.date, //日期
              "ship_time_text": item.time, //时间
              "buyer_msg": item.greeting ? item.remark + ' 祝福语：' + item.greeting : item.remark, //备注+祝福语   '备注内容'+' 祝福语：'+'祝福语内容'
            }
          } else {
            if (item.radio == 1) {
              var xobj = {
                "ship_type": "shop",
                "ship_date": item.date, //日期
                "ship_time_text": item.time, //时间
                "shop": item.shopObj,
                "rule_ids": item.product.distribution_rule_id ? item.product.distribution_rule_id : item.pinpai.distribution_rule_id, //配规
                "buyer_msg": item.greeting ? item.remark + ' 祝福语：' + item.greeting : item.remark, //备注+祝福语   '备注内容'+' 祝福语：'+'祝福语内容'
              }
            } else if (item.radio == 2) {
              var xobj = {
                "ship_type": "delivery",
                "ship_date": item.date, //日期
                "ship_time_text": item.time, //时间
                "rule_ids": item.product.distribution_rule_id ? item.product.distribution_rule_id : item.pinpai.distribution_rule_id, //配规
                "buyer_msg": item.greeting ? item.remark + ' 祝福语：' + item.greeting : item.remark, //备注+祝福语   '备注内容'+' 祝福语：'+'祝福语内容'
              }
            } else if (item.radio == 3) {
              var xobj = {
                "ship_type": "same",
                "ship_date": false, //日期
                "ship_time_text": item.product.peisong.delivery_text, //时间
                "rule_ids": item.product.distribution_rule_id ? item.product.distribution_rule_id : item.pinpai.distribution_rule_id, //配规
                "buyer_msg": item.greeting ? item.remark + ' 祝福语：' + item.greeting : item.remark, //备注+祝福语   '备注内容'+' 祝福语：'+'祝福语内容'
              }
            }
          }
        } else {
          var xobj = {
            "buyer_msg": item.remark, //备注+祝福语   '备注内容'+' 祝福语：'+'祝福语内容'
          }
        }
        this.$set(dataObj, item.id, xobj);
      })
      this.otherData.data = JSON.stringify(dataObj)
      if (this.dataDetail.cartIds) {
        this.act = 1
        this.otherData.cartIds = this.dataDetail.cartIds
      } else {
        this.act = 2
        this.otherData.product_id = this.dataDetail.product_id
        // this.otherData.quantity = this.dataDetail.quantity
        this.otherData.flag = this.dataDetail.flag
        this.otherData.cpbs = this.dataDetail.cpbs
        this.otherData.spec_id = this.dataDetail.spec_id
        this.otherData.taste_name = this.dataDetail.taste_name
        this.otherData.gid = this.dataDetail.gid
        this.otherData.quantity = this.dataDetail.quantity
      }
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    // 支付
    // ///////微信登录
    onBridgeReady(params, order_no) {
      this.isLoading = false
      var that = this
      // "jsApiParameters": { //支付信息
      //   "appId": "wx05cc5223511e93c3",
      //       "timeStamp": "1710496158",
      //       "nonceStr": "qx0rpl2z6aqb492cvejftx5p4dowya4u",
      //       "package": "prepay_id=wx15174918865168a10f39f811aca3ea0000",
      //       "signType": "MD5",
      //       "paySign": "F0A17328ADD15AA9171CAEB082261A47"
      // }
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
        "appId": params.appId,  //公众号名称，由商户传入
        "timeStamp": params.timeStamp, //支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        "nonceStr": params.nonceStr,  //支付签名随机串，不长于 32 位
        "package": params.package,//统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        "signType": params.signType,  //签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        "paySign": params.paySign, //支付签名
      },
        function (res) {
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            that.$toast('支付成功！');
            setTimeout(() => {
              cakeIsPaySuccess({
                order_no
              }).then(res => {
                if (res.code == 200) {
               
                  that.$router.replace({ path: "/order", query: { tabIndex: 1 } })
                
                }
              })
            }, 2500)
          } else if (res.err_msg === "get_brand_wcpay_request:fail") {
            that.$toast('支付失败！');
          }else if (res.err_msg === "get_brand_wcpay_request:cancel") {
            that.$toast('支付已取消');
          } else {
            that.$toast('支付失败！');
          }
          that.isLoading = false;

        });
    },
    input(e) {
      this.isShow = e
    },
    getResult(result, checked) {
      this.result = result
      this.checked = checked
    },
    judgmentPayDate() {
      this.getIsCard()
      let data = {
        address_id: this.addrShow.id,
        code: this.code2,
        total: this.total,
        act: this.act,
        fulika: this.result.join(","),
        phone: this.phoneNumber,
        paytotal: this.paytotal,
        ...this.otherData
      }
      // console.log(data)
      // return
      cakeIsPayDate(data).then(res => {
        if (res.code == 200) {
          // 福利卡支付价格
          this.dkprice = res.data.dkprice
          this.wxprice = res.data.wxprice
          this.ka_ids = res.data.ka_ids
          this.code = res.data.code
          if (this.wxprice != 0) {
            //   微信支付
            // console.log("微信支付")
            // 去支付
            if (!this.isWeiXin()) {
              this.$toast("请使用微信打开进行支付")
              this.isLoading = false
              return;
            }
            this.shoptoWxpay()
          } else {
            if (this.dkprice != 0) {
              // console.log("卡支付")
              this.isShow = true
              this.isLoading = false
            }
          }
        } else {
          this.$toast(res.msg)
          this.isLoading = false
        }
      })
    },
    onInput(key) {
      this.pass = key
      if (this.pass.length == 6) {
        this.isShow = false
        this.flkpay(this.pass)
        this.pass = ""
      }
    },
    // 福利卡支付
    flkpay(pass) {
      this.getIsCard()
      let data = {
        ka_ids: this.ka_ids,
        pass,
        address_id: this.addrShow.id,
        code: this.code,
        total: this.paytotal,
        act: this.act,
        phone: this.phoneNumber,
        ...this.otherData
      }
      cakeFlkpay(data).then(res => {
        this.isLoading = false
        this.$toast(res.msg)
        if (res.code == 200 && res.data) {
          this.getCard()
          // if (this.change == 0) {
          //   setTimeout(() => {
          //     that.$router.go(-1)
          //   }, 1000)
          // } else {
          setTimeout(() => {
            cakeIsPaySuccess({
              order_no: res.data.order_no
            }).then(res => {
              if (res.code == 200) {
                //   if (this.change == 0) {
                //     setTimeout(() => {
                //       that.$router.go(-1)
                //     }, 1000)
                //   } else {
                this.$router.replace({ path: "/order", query: { tabIndex: 1 } })
                //   }
              } else {
                this.$toast(res.msg)
              }
            })
          }, 2500)
          // }
        }
      })
    },
    // 支付
    toPay() {
      // console.log(this.result, this.checked)
      if (!this.addrShow) {
        this.$toast("您还没有配送地址")
        return
      }
      var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!reg_tel.test(this.phoneNumber)) {
        this.$toast("请输入正确的手机号")
        return
      }
      if (this.orderList.filter(item => item.product.peisong ? (item.product.peisong.can_same == 0 && item.product.peisong.can_ship == 0 && item.product.peisong.can_take == 0) : "" && item.cpbs == 2).length > 0) {
        this.$toast("该产品暂不可售，请重新选择产品下单")
        return
      }
      if (this.orderList.filter(item => (item.product.flag == 1 ? item.product.delivery == 0 : (item.product.peisong == "" || !item.product.peisong ||
        item.product.peisong.is_distribution == 0) && item.cpbs == 2)).length > 0) {
        this.$toast("您的当前地址暂不支持配送，请重新选择地址下单")
        return
      }
      if (this.orderList.filter(item => item.cpbs == 2 ? item.flag == 1 ? item.date == "" || item.time == "" : item.radio == 2 && (item.date == "" || item.time == "") : '').length > 0) {
        this.$toast("请选择配送信息")
        return
      }

      if (this.orderList.filter(item => item.radio == 1 && (item.date == "" || item.storeName == "" || item.time == "")).length > 0) {
        this.$toast("请选择自取信息")
        return
      }
      if (this.result.length == 0 && this.checked == "") {
        this.$toast("请选择支付方式")
        return
      }
      this.isLoading = true
      // if (this.result.length == 0 && this.checked != "") {
      //   // 去支付
      //   if (!this.isWeiXin()) {
      //     this.$toast("请使用微信打开进行支付")
      //     this.isLoading = false
      //     return;
      //   }
      //   this.shoptoWxpay()
      // } else {
      this.judgmentPayDate()
      // }
    },
    shoptoWxpay() {
      this.getIsCard()
      let data = {
        phone: this.phoneNumber,
        ka_ids: this.ka_ids,
        address_id: this.addrShow.id,
        code: this.code,
        total: this.paytotal,
        act: this.act,
        openid: this.openid,
        ...this.otherData
      }
      // this.$toast({message:data.openid,duration:0})
      cakewxpay(data).then(res => {
        // this.$toast(res.msg)
        if (res.code == 200) {
          this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
        } else {
          this.$toast(res.msg)
          this.isLoading = false
        }
      })
    },
    //支付end
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(",") ? price.toString().includes(".") ? price.toString().split('.')[1] : "00" : price.toString().includes(".") ? price.toString().split('.')[1] : "00"
    },
    changeAdress() {
      sessionStorage.removeItem("dateList")
      this.$router.push("/cakeAddressList?change=0")
    },
    // 订单详情
    getCheckout(data) {
      this.orderList = []
      toCheckout(data).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.addrShow = res.data.addr_show
          this.total = res.data.total
          this.paytotal = res.data.total
          this.code2 = res.data.code
          if (this.withChecked) {
            this.phoneNumber = this.addrShow.phone
            this.disabled = true
          } else {
            this.phoneNumber = sessionStorage.getItem("phoneNum")
            this.disabled = false
          }
          res.data.jiesuan_list.forEach(item => {
          // flag=1 的蛋糕产品，手动构建配送数据
        if (item.cpbs == 2 && item.product.flag == 1) {
          item.product.peisong = {
            can_take: 0,
            can_ship: 1,      // 只能送货上门
            can_same: 0,
            is_distribution: item.product.delivery,
            validate_delivery_dates: [],  // 后面通过 generateDaysList 生成
            validate_take_dates: null,
            delivery_text: null
          }
        }
        

            var radio = ""
            if (item.product.peisong) {
              if (item.product.peisong.can_ship == 1) {
                radio = "2"
              } else if (item.product.peisong.can_same == 1) {
                radio = "3"
              } else if (item.product.peisong.can_take == 1) {
                radio = "1"
              }
            }
            this.orderList.push({
              ...item,
              radio:radio || '2',
              showDate: false,
              showTime: false,
              storeName: "",
              greeting: "",
              remark: "",
              date: "",
              time: "",
              deliveryCharge: "0",
              shopObj: {}
            })
          })
          // if (this.orderList.filter(item => item.product.peisong == "").length > 0) {
          //  this.isBuy = true
          // }
          if (this.dataList.length > 0) {
            this.dataList.forEach(item => {
              this.orderList.forEach((item2, index) => {
                if (item.indexs == index) {
                  item2.storeName = item.name
                  item2.shopObj = {
                    id: item.id,
                    name: item.name,
                    detail: item.detail,
                  }
                }
              })
            })
          }
          if (this.radioList.length > 0) {
            this.radioList.forEach(item => {
              this.orderList.forEach((item2, index) => {
                if (item.indexs == index) {
                  item2.radio = item.radio
                }
              })
            })
          }
          if (this.dateList.length > 0) {
            this.dateList.forEach(item => {
              this.orderList.forEach((item2, index) => {
                if (item.indexs == index) {
                  item2.date = item.date
                  item2.time = item.time
                }
              })
            })
          }
          if (this.greetingList.length > 0) {
            this.greetingList.forEach(item => {
              this.orderList.forEach((item2, index) => {
                if (item.indexs == index) {
                  item2.greeting = item.greeting
                  item2.remark = item.remark
                  const regex = /[^\u4e00-\u9fa5a-zA-Z0-9]+/g; // 正则表达式匹配特殊字符
                  item.greeting = item.greeting.replace(regex, '')
                  item.remark = item.remark.replace(regex, '')
                }
              })
            })
          }
          if (this.deliveryChargeList.length > 0) {
            this.deliveryChargeList.forEach(item => {
              this.orderList.forEach((item2, index) => {
                if (item.indexs == index) {
                  item2.deliveryCharge = item.deliveryCharge
                  this.paytotal = (Number(this.paytotal) + Number(item.deliveryCharge ? item.deliveryCharge : 0)).toFixed(2)
                }
              })
            })
          }


            this.generateDaysList(15);
          // console.log(this.orderList,"this.orderList")
        }
      })
    },
    //   卡列表
    getCard() {
      getflkList().then(res => {
        if (res.code == 200) {
          this.cardList = res.data.card_list

          if (this.cardList.length !== 0) {
            this.result.push(this.cardList[0].id)
          }
        }
      })
    },
  },
  created() {
     
    this.dataDetail = JSON.parse(this.$route.query.data)
    this.getCheckout(this.dataDetail)
    this.getCard()
    if (localStorage.getItem("openid")) {
      this.openid = localStorage.getItem("openid")
    }
    this.type = this.$route.query.type
    if (sessionStorage.getItem("radio")) {
      this.radio = sessionStorage.getItem("radio")
    }
    if (sessionStorage.getItem("isPhone")) {
      this.withChecked = sessionStorage.getItem("isPhone") == "false" ? false : true
    }
    if (sessionStorage.getItem("StoreName")) {
      this.dataList = JSON.parse(sessionStorage.getItem("StoreName"))
    }
    if (sessionStorage.getItem("radio")) {
      this.radioList = JSON.parse(sessionStorage.getItem("radio"))
    }
    if (sessionStorage.getItem("dateList")) {
      this.dateList = JSON.parse(sessionStorage.getItem("dateList"))
    }
    if (sessionStorage.getItem("greetingList")) {
      this.greetingList = JSON.parse(sessionStorage.getItem("greetingList"))
    }
    if (sessionStorage.getItem("deliveryChargeList")) {
      this.deliveryChargeList = JSON.parse(sessionStorage.getItem("deliveryChargeList"))
    }
     
    // 测试时间段功能
    setTimeout(() => {
      console.log('=== 时间段功能测试 ===');
      console.log('默认时间段:', this.timeList);
      console.log('21cake时间段 (633):', this.timeList21cake);
      console.log('624/635时间段:', this.timeList624635);
      console.log('测试品牌ID 633 (21cake):', this.getTimeListByBrand('633'));
      console.log('测试品牌ID 624:', this.getTimeListByBrand('624'));
      console.log('测试品牌ID 635:', this.getTimeListByBrand('635'));
      console.log('测试品牌ID 其他:', this.getTimeListByBrand('999'));
    }, 2000);
  },
}
</script>
<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  padding: 10px;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 66px;
}


.addressBox {
  padding: 13px 10px;
  background-color: white;
  border-radius: 10px;

  .address {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .addressIcon {
    width: 20px;
  }

  .phone {
    padding-left: 10px;
    font-size: 12px;
    color: #797979;
  }

  .addressDetail {
    font-size: 13px;
    font-weight: bold;
    margin-top: 3px;
  }

  .userName {
    font-size: 15px;
    font-weight: bold;
  }

  .leftBox {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.addressBox2 {
  margin-top: 10px;
  padding: 13px 15px 15px;
}

.addressBox3 {
  padding: 0px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .rightBox {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .toPay {
    background-image: linear-gradient(to right, #F65958, #DD0A09);
    color: white;
    border-radius: 30px;
    text-align: center;
    width: 106px;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
  }

  .allNumber {
    font-size: 13px;
    color: #7a7979;
  }

  .all {
    font-weight: bold;
    font-size: 15px;

    .price {
      color: #CA4240;
      font-size: 20px;
    }

    .priceNum {
      color: #CA4240;
    }
  }
}

.itemTitle {
  font-weight: bold;
  font-size: 15px;
}

.textarea {
  background-color: #F6F6F6;
  height: 94px;
  border-radius: 3px;
  margin-top: 5px;
  padding: 10px;
  box-sizing: border-box;
}

.textarea textarea {
  border: none;
  background-color: #fff0;
  font-size: 13px;
}

.orderInfo {
  .shopPrice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
  }

  .shopPriceText {
    color: #828282;
    font-size: 14px;
  }

  .price {
    font-size: 14px;
    font-weight: bold;
  }

  .price1 {
    color: #C93F3D;
  }
}

.shopInfo {
  margin-top: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .shopImg {
    width: 80px;
    height: 80px;
  }

  .nameBox {
    width: 73%;
  }

  .shopName {
    font-size: 14px;
    font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    /* 显示两行 */
  }

  .can {
    margin-top: 7px;
    font-size: 13px;
    color: #979797;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1;
    /* 显示两行 */
  }

  .all {
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
  }

  .price {
    color: #C63532;
    font-weight: bold;
    font-size: 15px;
  }

  .number {
    color: #989898;
  }
}

.loadingBox {
  width: 122px;
  position: fixed;
  top: calc(50% - 17px);
  left: calc(50% - 61px);
  background-color: rgba(50, 50, 51, .88);
  border-radius: 4px;
  height: 34px;
  line-height: 27px;
}

/deep/ .van-loading {
  color: white !important;
}

/deep/ .loadingText {
  color: #ffffff !important;
}

.phoneBox {
  display: flex;
  align-items: center;
  font-size: 14px;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid #efefef;
  padding: 10px 0px;
  position: relative;

  .phoneNumber {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 70%;
  }

  .phoneTitle {
    font-weight: bold;
    white-space: nowrap;
  }

  .with {
    display: flex;
    align-items: center;
    gap: 5px;
    width: 30%;
    justify-content: flex-end;
  }

  .withText {
    //white-space: nowrap;
    font-size: 13px;
    color: #A6A6A6;
  }

  .withIcon {
    padding-top: 4px;
  }

  /deep/ .van-checkbox__icon .van-icon {
    width: 18px;
    height: 18px;
    line-height: 18px;
  }
}

.phoneInp {
  width: 70%;
}

.phoneInp input {
  width: 100%;
  border: none;
  background: none;
}

.noReapt {
  color: #D25D5B;
  border: 1px solid #D25D5B;
  display: inline-block;
  font-size: 10px;
  margin-top: 5px;
  border-radius: 2px;
  padding: 0px 5px 1px;
}

/deep/ .van-stepper__input {
  background-color: rgba(242, 243, 245, 0);
  font-size: 16px;
}

/deep/ .van-stepper__minus {
  background-color: rgba(242, 243, 245, 0);
  border-radius: 50%;
  border: 1px solid #b0b0b0;
  width: 25px;
  height: 25px;
}

/deep/ .van-stepper__plus {
  background-color: #CA403E;
  border-radius: 50%;
  width: 25px;
  height: 25px;
}

.van-stepper__minus::after,
.van-stepper__minus::before,
/deep/ .van-stepper__plus::after,
/deep/ .van-stepper__plus::before {
  background-color: #ffffff;
}

.totalBox {
  border-top: 1px solid #F6F6F6;
  margin-top: 10px;
  padding-top: 10px;
  text-align: end;
  font-size: 14px;
}

.priceIcon {
  color: #CB4342;
  font-size: 13px;
}

.price2 {
  color: #CB4342;
  font-size: 16px;
}

.priceNmber {
  color: #CB4342;
  font-size: 13px;
}

.phoneBox1 {
  border: none;
  border-top: 1px solid #efefef;
  margin-top: 10px;
  padding-bottom: 0px
}

.radioBox {
  color: #B0B0B0;
  display: flex;
  align-items: center;
  gap: 15px;
}

/deep/ .van-radio__label--left {
  color: #818181;
  font-size: 13px;
}

//弹窗
/deep/ .van-overlay {
  position: absolute;
  display: none;
}

/deep/ .van-popup--top {
  width: 37%;
  border-radius: 10px;
  transition: none;
  position: absolute;
}

/deep/ .van-popup {
  max-height: 570%;
}

.popup1 {
  /deep/ .van-popup--top {
    top: 37px;
    left: 82%;
    box-shadow: 0px 0px 5px -1px #0000004f;
  }

  .synthesisItem {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 15px;
    font-size: 12px;
    color: #626262;
    border-top: 1px solid #F9F9F9;
  }

  .addRegion {
    color: #D25053;
  }

  .select {
    text-align: center;
    padding: 10px 0px;
    font-size: 14px;
    color: #C9283C;
  }
}

.with2 {
  width: 76% !important;
  font-size: 12px;
}
</style>