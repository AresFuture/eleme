<template>
	<transition name="fold">
		<div v-show="showFlag" class="food" ref="food">
			<div class="food-content">
				<div class="img-header">
					<img :src="food.image" />
					<div class="back" @click="hide">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}</span>
						<span class="rating">好评率{{food.rating}}</span>
					</div>
					<div class="price">
						<span class="now">¥ {{food.price}}</span>
						<span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
					</div>
					<div class="cartcontrol-wrapper">
						<cartcontrol :food="food"></cartcontrol>
					</div>
					<transition name="fade">
						<div class="buy" v-show="!food.count || food.count===0" @click="addFirst">加入购物车</div>
					</transition>
				</div>
				<split v-show="food.info"></split>
				<div class="info" v-show="food.info">
					<h1 class="title">商品信息</h1>
					<p class="text">{{food.info}}</p>
				</div>
				<split></split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img class="avatar" :src="rating.avatar" alt="" width="12" height="12" />
								</div>
								<div class="time">{{rating.rateTime | formatDate}}</div>
								<p class="text">
									<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType ===1}"></span>{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import BScroll from 'better-scroll';
	import Vue from 'vue';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import split from 'components/split/split';
	import ratingselect from 'components/ratingselect/ratingselect';
	import {formatDate} from '../../common/js/date';

	const POSITIVE = 0;
	const NEGATIVE =1;
	const ALL = 2;

	export default{
		props:{
			food:{
				type:Object
			}
		},
		data(){
			return{
				showFlag:false,
				selectType:ALL,
				onlyContent:true,
				desc:{
					all:'全部',
					positive:'推荐',
					negetive:'吐槽'
				}
			};
		},
		created() {
			this.$on('ratingtype.select',this.ratingtypeSelect);
			this.$on('content.toggle',this.contentToggle);
		},
		methods:{
			show(){
				this.showFlag = true;
				this.selectType = ALL;
				this.onlyContent = true;
				this.$nextTick(() => {
					if(!this.scroll){
						this.scroll = new BScroll(this.$refs.food,{
							click:true
						});
					}else{
						this.scroll.refresh;
					}
				});
			},
			hide(){
				this.showFlag = false;
			},
			addFirst(){
				if(!event._constructed){
					return;
				}
				this.$parent.$emit('cart.add',event.target);
				Vue.set(this.food,'count',1);
			},
			needShow(type,text){
				if(this.onlyContent && !text){
					return false;
				}
				if(this.selectType === ALL){
					return true;
				}else{
					return type === this.selectType;
				}
			},
			ratingtypeSelect(type){
				this.selectType = type;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			},
			contentToggle(onlyContent){
				this.onlyContent = onlyContent;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			}
		},
		filters:{
			formatDate(time){
				let date = new Date(time);
				return formatDate(date,'yyyy-MM-dd hh:mm');
			}
		},
		components:{
			cartcontrol,
			split,
			ratingselect
		}
	};
</script>

<style lang="scss">
	@import "../../common/scss/mixin.scss";

	.food{
		position:absolute;
		top:0;
		left:0;
		bottom:48px;
		z-index: 30;
		width:100%;
		background: #fff;
		transform: translate3d(0,0,0);
		&.fold-enter-active, &.fold-leave-active{
			transition: all 0.2s;
			transform: translate3d(0,0,0);
		}
		&.fold-enter, &.fold-leave-active{
			transform: translate3d(100%, 0, 0);
		}
		.food-content{
			.img-header{
				position: relative;
				width:100%;
				height:0;
				padding-bottom: 100%;
				img{
					position: absolute;
					top: 0;
					left: 0;
					width:100%;
					height: 100%;
				}
				.back{
					position: absolute;
					top:10px;
					left: 0;
					.icon-arrow_lift{
						display: block;
						padding: 10px;
						font-size: 20px;
						color:#fff;
					}
				}
			}
			.content{
				position: relative;
				padding: 18px;
				.title{
					line-height: 14px;
					margin-bottom: 8px;
					font-size: 14px;
					font-weight: 700;
					color: rgb(7,17,27);
				}
				.detail{
					margin-bottom: 18px;
					line-height: 10px;
					height: 10px;
					font-size: 0;
					.sell-count,.rating{
						font-size: 10px;
						color: rgb(147,153,159);
					}
					.sell-count{
						margin-right: 12px;
					}
				}
				.price{
					font-weight:700;
					line-height:24px;
					.now{
						color:rgb(240,20,20);
					}
					.old{
						text-decoration:line-through;
						font-size:10px;
						color:rgb(147,153,159);
					}
				}
				.cartcontrol-wrapper{
					position: absolute;
					bottom: 12px;
					right: 12px;
				}
				.buy{
					position: absolute;
					right: 18px;
					bottom: 18px;
					z-index: 10;
					height: 24px;
					line-height: 24px;
					padding: 0 12px;
					box-sizing: border-box;
					font-size: 10px;
					border-radius: 12px;
					color: #fff;
					background:rgb(0,160,220);
				}
				.fade-enter-active,.fade-leave-active{
					transition:all 0.2s linear;
					opacity:1;
					background:rgba(7,17,27,0.6);

				}
				.fade-enter,.fade-leave-active{
					opacity: 0;
					background:rgba(7,17,27,0);
				}
			}
			.info{
				padding: 18px;
				.title{
					line-height: 14px;
					margin-bottom: 6px;
					font-size: 14px;
					color:rgb(7,17,27);
				}
				.text{
					line-height: 24px;
					padding: 0 8px;
					font-size:12px;
					color:rgb(77,85,93);
				}
			}
			.rating{
				padding:18px 0 60px 0;
				.title{
					line-height: 14px;
					margin-left: 6px;
					font-size: 14px;
					color:rgb(7,17,27);
				}
				.rating-wrapper{
					padding: 0 18px;
					.rating-item{
						position: relative;
						padding: 16px 0;
						@include border-1px(rgba(7,17,27,0.1));
						.user{
							position: absolute;
							right: 0;
							top: 16px;
							line-height: 12px;
							font-size: 0;
							.name{
								display: inline-block;
								margin-right: 6px;
								vertical-align: top;
								font-size: 10px;
								color:rgb(147,153,159);
							}
							.avatar{
								
							}
						}
						.time{
							line-height: 12px;
							font-size: 10px;
							color:rgb(147,153,159);
							margin-bottom: 6px;
						}
						.text{
							line-height: 16px;
							font-size: 12px;
							color:rgb(7,17,27);
							.icon-thumb_up,.icon-thumb_down{
								margin-right: 4px;
								line-height: 16px;
								font-size: 12px;
							}
							.icon-thumb_up{
								color:rgb(0,160,220);
							}
							.icon-thumb_down{
								color:rgb(147,153,159);
							}

						}
					}
					.no-rating{
						padding: 16px 0;
						font-size: 12px;
						color:rgb(147,153,159);
					}
				}
			}
		}
	}
</style>