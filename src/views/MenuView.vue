<script setup lang="ts">
import { ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'
import { useLang } from '@/composables/useLang'
import { translations } from '@/i18n'

const { lang } = useLang()

type FilterKey = '冷盤' | '熱前菜' | '配菜' | '主食' | '湯品' | '甜點' | '無酒精飲品' | '酒精飲品'

interface MenuItem {
  name: string
  nameEn: string
  desc: string
  descEn: string
  category: FilterKey
  vege?: '全素' | '蛋奶素'
}

const categoryImages: Record<FilterKey, string> = {
  '冷盤':    '/images/menu-cold-appetizer.webp',
  '熱前菜':  '/images/menu-hot-appetizer.webp',
  '配菜':    '/images/menu-side-dish.webp',
  '主食':    '/images/menu-main-dish.webp',
  '湯品':    '/images/menu-soup.webp',
  '甜點':    '/images/menu-dessert.webp',
  '無酒精飲品': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80',
  '酒精飲品': 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
}

const menuItems: MenuItem[] = [
  // 冷盤 · Cold Starters
  {
    name: '桔醬漬干貝・柚香泡沫',
    nameEn: 'Citrus-Marinated Scallop & Pomelo Foam',
    desc: '客家桔醬結合生食級干貝，點綴清新柚香泡沫。',
    descEn: 'Sashimi-grade scallop dressed in Hakka citrus sauce, topped with refreshing pomelo foam.',
    category: '冷盤',
  },
  {
    name: '油蔥舒肥鴨胸',
    nameEn: 'Slow-Cooked Duck Breast & Shallot Oil',
    desc: '低溫熟成鴨胸，搭配客家油蔥香氣，細緻不膩。',
    descEn: 'Sous-vide duck breast infused with Hakka shallot oil — delicate and richly fragrant.',
    category: '冷盤',
  },
  {
    name: '醃漬時蔬・擂茶油醋',
    nameEn: 'Pickled Seasonal Vegetables & Lei Cha Vinaigrette',
    desc: '季節蔬菜佐擂茶風味油醋，清爽開胃。',
    descEn: 'Seasonal vegetables dressed in lei cha–flavored vinaigrette — bright and refreshing.',
    category: '冷盤',
    vege: '全素',
  },
  {
    name: '桔醬漬山藥・苦茶油',
    nameEn: 'Citrus-Pickled Yam & Bitter Tea Oil',
    desc: '爽脆山藥結合客家桔醬，酸甜清新開胃。',
    descEn: 'Crisp yam in Hakka citrus marinade — sweet, tart, and light.',
    category: '冷盤',
    vege: '全素',
  },
  {
    name: '溫泉蛋・擂茶奶油醬',
    nameEn: 'Onsen Egg & Lei Cha Cream',
    desc: '滑嫩蛋黃搭配擂茶奶油，香氣溫潤細緻。',
    descEn: 'Silky soft-boiled egg with lei cha butter cream — warm, delicate, and aromatic.',
    category: '冷盤',
    vege: '蛋奶素',
  },
  // 熱前菜 · Hot Starters
  {
    name: '紅糟炸雞翅・山椒鹽',
    nameEn: 'Red Yeast Fried Chicken Wings & Sansho Salt',
    desc: '紅糟醃漬後酥炸，外酥內嫩，帶微微發酵香氣。',
    descEn: 'Marinated in red yeast rice then deep-fried until crispy, with a subtle fermented aroma.',
    category: '熱前菜',
  },
  {
    name: '鹹豬肉塔可',
    nameEn: 'Salt-Cured Pork Taco',
    desc: '台式與墨西哥融合，清爽又有風味衝擊。',
    descEn: 'Taiwanese–Mexican fusion — bright, refreshing, and full of character.',
    category: '熱前菜',
  },
  {
    name: '客家小炒風味豆干球',
    nameEn: 'Hakka Stir-Fry Flavored Tofu Balls',
    desc: '以豆干重現小炒風味，外層微酥、內裡保留彈性口感。',
    descEn: 'Tofu skin crafted to echo the taste of Hakka stir-fry — crisp outside, bouncy within.',
    category: '熱前菜',
    vege: '全素',
  },
  {
    name: '剝皮辣椒起司可樂餅',
    nameEn: 'Skinned Chili & Cheese Croquette',
    desc: '微辣剝皮辣椒融合起司，炸至金黃酥脆。',
    descEn: 'A gentle heat from skinned chili combined with melted cheese, fried golden.',
    category: '熱前菜',
    vege: '蛋奶素',
  },
  {
    name: '起司粄條脆餅',
    nameEn: 'Crispy Ban Tiau Cheese Crackers',
    desc: '酥脆粄條結合濃郁起司，鹹香交織。',
    descEn: 'Crispy flat rice noodles layered with rich cheese — salty and satisfying.',
    category: '熱前菜',
    vege: '蛋奶素',
  },
  // 配菜 · Sides
  {
    name: '炭烤鹹豬肉・鳳梨莎莎',
    nameEn: 'Chargrilled Salt-Cured Pork & Pineapple Salsa',
    desc: '鹹香豬肉結合清爽果香，層次分明。',
    descEn: 'Smoky salt-cured pork meets bright tropical salsa — bold in contrast.',
    category: '配菜',
  },
  {
    name: '客家紅糟鴨腿・酒香醬汁',
    nameEn: 'Hakka Red Yeast Duck Leg & Wine Jus',
    desc: '紅糟發酵風味入菜，鴨肉柔嫩香氣濃厚。',
    descEn: 'Red yeast fermentation brings depth and warmth to tender, fall-off-the-bone duck.',
    category: '配菜',
  },
  {
    name: '椒麻福菜燉海鱸',
    nameEn: 'Mala Preserved Mustard Braised Sea Bass',
    desc: '福菜與微辣椒麻結合，帶出魚肉鮮甜。',
    descEn: 'Fukucai preserved mustard and numbing spice lift the sweetness of the sea bass.',
    category: '配菜',
  },
  {
    name: '福菜慢燉野菇鍋',
    nameEn: 'Slow-Braised Wild Mushroom & Fukucai Pot',
    desc: '多種野菇與福菜慢火燉煮，湯頭深邃回甘。',
    descEn: 'A medley of wild mushrooms slow-simmered with fukucai — deep, savory, and lingering.',
    category: '配菜',
    vege: '全素',
  },
  {
    name: '擂茶堅果燉南瓜',
    nameEn: 'Lei Cha & Nut Braised Pumpkin',
    desc: '綿密南瓜搭配擂茶醬，溫潤濃郁。',
    descEn: 'Velvety pumpkin cloaked in lei cha sauce — earthy, warm, and comforting.',
    category: '配菜',
    vege: '全素',
  },
  {
    name: '福菜奶油燉時蔬',
    nameEn: 'Fukucai Butter Braised Seasonal Vegetables',
    desc: '福菜鹹香融入奶油白醬，濃郁滑順。',
    descEn: "Fukucai's salty depth folded into a silky butter cream sauce.",
    category: '配菜',
    vege: '蛋奶素',
  },
  // 主食 · Mains
  {
    name: '客家小炒燉飯',
    nameEn: 'Hakka Stir-Fry Risotto',
    desc: '經典小炒融合義式燉飯，濃郁不厚重。',
    descEn: 'The classic Hakka stir-fry reimagined as a creamy risotto — rich but not heavy.',
    category: '主食',
  },
  {
    name: '柑橘雞胸冷麵',
    nameEn: 'Citrus Poached Chicken Cold Noodles',
    desc: '酸甜清爽，適合輕食需求。',
    descEn: 'Light and refreshing — bright citrus and tender chicken over cold noodles.',
    category: '主食',
  },
  {
    name: '鹹豬肉蒜香炒飯',
    nameEn: 'Salt-Cured Pork & Garlic Fried Rice',
    desc: '高溫快炒，蒜香與鹹豬肉完美融合。',
    descEn: 'High-heat wok-tossed fried rice with smoky pork and toasted garlic.',
    category: '主食',
  },
  {
    name: '油蔥雞汁拌粄條',
    nameEn: 'Shallot Oil & Chicken Broth Tossed Ban Tiau',
    desc: '雞汁與油蔥提味，簡單卻層次分明。',
    descEn: 'Flat rice noodles tossed in chicken broth and shallot oil — simply layered.',
    category: '主食',
  },
  {
    name: '油蔥香拌粄條',
    nameEn: 'Shallot Oil Tossed Ban Tiau',
    desc: '植物油蔥提香，風味純粹飽滿。',
    descEn: 'Plant-based shallot oil — pure, fragrant, and satisfying.',
    category: '主食',
    vege: '全素',
  },
  {
    name: '野菇擂茶燉飯',
    nameEn: 'Wild Mushroom & Lei Cha Risotto',
    desc: '茶香與菇類鮮味交織，層次細膩。',
    descEn: 'Tea-infused broth and mushroom umami woven into a delicate risotto.',
    category: '主食',
    vege: '全素',
  },
  // 湯品 · Soups
  {
    name: '慢燉福菜蛤蜊湯',
    nameEn: 'Slow-Braised Fukucai & Clam Soup',
    desc: '福菜結合蛤蜊鮮味，清爽卻富有深度。',
    descEn: "Fukucai's earthiness meets the clean brine of clams — light with hidden depth.",
    category: '湯品',
  },
  {
    name: '老菜脯燉排骨',
    nameEn: 'Aged Cai Pu Pork Rib Broth',
    desc: '經年老菜脯慢燉，風味濃厚甘醇。',
    descEn: 'Long-aged radish preserves and slow-cooked pork ribs — warming and richly savory.',
    category: '湯品',
  },
  {
    name: '酸菜白肉湯・輕發酵版',
    nameEn: 'Sauerkraut & Pork Soup (Lightly Fermented)',
    desc: '改良客家酸菜，酸香清爽不厚重。',
    descEn: 'A refined version of Hakka sauerkraut soup — bright acidity without heaviness.',
    category: '湯品',
  },
  {
    name: '擂茶野菇清湯',
    nameEn: 'Lei Cha Wild Mushroom Broth',
    desc: '茶香與菇類鮮味融合，清新回甘。',
    descEn: 'Delicate mushroom broth with tea fragrance — clear, aromatic, and revitalizing.',
    category: '湯品',
    vege: '全素',
  },
  {
    name: '福菜豆腐味噌湯',
    nameEn: 'Fukucai Tofu Miso Soup',
    desc: '福菜結合味噌，鹹香溫潤。',
    descEn: "Fukucai's brine meets miso's warmth — salty, soothing, and deeply nourishing.",
    category: '湯品',
    vege: '全素',
  },
  // 甜點 · Desserts
  {
    name: '擂茶提拉米蘇',
    nameEn: 'Lei Cha Tiramisu',
    desc: '擂茶融入經典甜點，細緻回甘。',
    descEn: 'Lei cha folded into a classic tiramisu — subtle and sweetly lingering.',
    category: '甜點',
    vege: '蛋奶素',
  },
  {
    name: '柿餅冰淇淋・黑糖脆片',
    nameEn: 'Dried Persimmon Ice Cream & Brown Sugar Crisp',
    desc: '果乾甜味與黑糖香氣結合，清爽收尾。',
    descEn: 'Dried fruit sweetness and caramelized brown sugar — a light, memorable finish.',
    category: '甜點',
    vege: '蛋奶素',
  },
  // 無酒精飲品 · Non-Alcoholic
  {
    name: '氣泡擂茶飲',
    nameEn: 'Sparkling Lei Cha',
    desc: '擂茶結合氣泡口感，清爽解膩。',
    descEn: 'Lei cha with a refreshing effervescent twist.',
    category: '無酒精飲品',
    vege: '全素',
  },
  {
    name: '桂花烏龍冷萃',
    nameEn: 'Osmanthus Cold-Brew Oolong',
    desc: '淡雅花香與茶韻，清新順口。',
    descEn: 'Delicate floral notes and tea complexity — cool and graceful.',
    category: '無酒精飲品',
    vege: '全素',
  },
  // 酒精飲品 · Alcoholic
  {
    name: '擂茶琴酒調酒',
    nameEn: 'Lei Cha Gin Cocktail',
    desc: '擂茶與琴酒結合，帶有草本與堅果香氣。',
    descEn: 'Lei cha meets gin — herbal, nutty, and botanical.',
    category: '酒精飲品',
  },
  {
    name: '桔香威士忌Highball',
    nameEn: 'Citrus Whisky Highball',
    desc: '客家桔醬融合威士忌氣泡，清爽微酸。',
    descEn: 'Hakka citrus sauce with effervescent whisky — bright and lightly tart.',
    category: '酒精飲品',
  },
  {
    name: '客家酸柑茶啤酒',
    nameEn: 'Hakka Citrus Tea Beer',
    desc: '在地風味啤酒，帶柑橘與茶香尾韻。',
    descEn: 'A local craft beer with citrus and tea finish.',
    category: '酒精飲品',
  },
]

const filters: FilterKey[] = ['冷盤', '熱前菜', '配菜', '主食', '湯品', '甜點', '無酒精飲品', '酒精飲品']

const activeFilter = ref<FilterKey>('冷盤')

const filtered = computed(() => menuItems.filter(item => item.category === activeFilter.value))

const currentImage = computed(() => categoryImages[activeFilter.value])

function categoryLabel(key: string): string {
  return translations[lang.value].menu.categories[key] ?? key
}

function vegeLabel(key: string): string {
  return translations[lang.value].menu.vege[key] ?? key
}

function itemName(item: MenuItem): string {
  return lang.value === 'en' ? item.nameEn : item.name
}

function itemDesc(item: MenuItem): string {
  return lang.value === 'en' ? item.descEn : item.desc
}

</script>

<template>
  <div class="min-h-screen bg-black text-white flex flex-col">
    <NavBar />

    <main class="flex-1 w-full pt-48 pb-32">

        <!-- Two-column body -->
        <div class="flex flex-col lg:flex-row lg:items-start">

          <!-- Left: category image — flush to left edge -->
          <div class="w-full lg:w-[45%] xl:w-[42%] lg:sticky lg:top-0 shrink-0 self-start mb-10 lg:mb-0">
            <div class="relative w-full aspect-square overflow-hidden">
              <transition name="img">
                <img
                  :key="activeFilter"
                  :src="currentImage"
                  :alt="activeFilter"
                  class="absolute inset-0 w-full h-full object-cover"
                />
              </transition>
              <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%);"></div>
            </div>
          </div>

          <!-- Right: filter bar + item list -->
          <div class="flex-1 min-w-0 px-6 md:px-12 lg:px-16">
            <!-- Filter bar -->
            <div class="flex flex-wrap gap-2 mb-10">
              <button
                v-for="f in filters"
                :key="f"
                @click="activeFilter = f"
                class="px-4 py-1.5 rounded-full text-xs tracking-widest transition-all duration-200"
                :class="activeFilter === f
                  ? 'bg-amber-600 text-white'
                  : 'border border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white'"
              >
                {{ categoryLabel(f) }}
              </button>
            </div>

            <transition-group name="item" tag="div" class="divide-y divide-neutral-900">
              <div
                v-for="item in filtered"
                :key="item.name"
                class="flex items-start gap-3 py-5"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span
                      v-if="item.vege === '全素'"
                      class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-widest leading-none shrink-0"
                      style="background: rgba(74,148,74,0.15); color: #5db85d; border: 1px solid rgba(74,148,74,0.4);"
                    >{{ vegeLabel('全素') }}</span>
                    <span
                      v-else-if="item.vege === '蛋奶素'"
                      class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-widest leading-none shrink-0"
                      style="background: rgba(180,130,40,0.12); color: #c49a30; border: 1px solid rgba(180,130,40,0.4);"
                    >{{ vegeLabel('蛋奶素') }}</span>
                    <span class="text-white text-sm font-medium">{{ itemName(item) }}</span>
                  </div>
                  <p class="text-neutral-500 text-xs mt-1 leading-relaxed">{{ itemDesc(item) }}</p>
                </div>
              </div>
            </transition-group>
          </div>

        </div>
    </main>

    <FooterSection />
  </div>
</template>

<style scoped>
/* Item list transition */
.item-move,
.item-enter-active,
.item-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.item-enter-from,
.item-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.item-leave-active {
  position: absolute;
}

/* Image crossfade */
.img-enter-active,
.img-leave-active {
  transition: opacity 0.5s ease;
}
.img-enter-from,
.img-leave-to {
  opacity: 0;
}
</style>
