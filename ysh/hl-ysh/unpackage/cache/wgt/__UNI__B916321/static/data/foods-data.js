/**
 * 食物数据文件
 * 包含各种食物分类及其营养成分数据
 */

export default {
	grain: [
		{ name: '挂面', description: '面食制品', image: '/static/images/noodles.png', energy: 3.53, protein: 0.114, fat: 0.009, carbohydrate: 0.751, fiber: 0.009, vitaminA: 0, vitaminB1: 0.0017, vitaminB2: 0.0004, vitaminC: 0, calcium: 0.2, iron: 0.023, zinc: 0.0072, selenium: 0.0921, folate: 0.21, dha: 0 },
		{ name: '馒头', description: '面食制品', image: '/static/images/steamed-bread.png', energy: 2.23, protein: 0.07, fat: 0.011, carbohydrate: 0.47, fiber: 0.013, vitaminA: 0, vitaminB1: 0.0004, vitaminB2: 0.0005, vitaminC: 0, calcium: 0.38, iron: 0.018, zinc: 0.0071, selenium: 0.0845, folate: 0.05, dha: 0 },
		{ name: '油条', description: '油炸面食', image: '/static/images/fried-dough.png', energy: 3.88, protein: 0.069, fat: 0.176, carbohydrate: 0.51, fiber: 0.009, vitaminA: 0, vitaminB1: 0.0001, vitaminB2: 0.0007, vitaminC: 0, calcium: 0.06, iron: 0.01, zinc: 0.0075, selenium: 0.086, folate: 0, dha: 0 },
		{ name: '稻米', description: '主食谷物', image: '/static/images/rice.png', energy: 3.46, protein: 0.079, fat: 0.009, carbohydrate: 0.772, fiber: 0.006, vitaminA: 0, vitaminB1: 0.0015, vitaminB2: 0.0004, vitaminC: 0, calcium: 0, iron: 0.011, zinc: 0.0154, selenium: 0.0283, folate: 0, dha: 0 },
		{ name: '玉米', description: '粗粮谷物', image: '/static/images/corn.png', energy: 2.4348, protein: 0.087, fat: 0.0261, carbohydrate: 0.4957, fiber: 0.0630, vitaminA: 0, vitaminB1: 0.0035, vitaminB2: 0.0024, vitaminC: 0.3478, calcium: 0, iron: 0.0239, zinc: 0.0196, selenium: 0.0354, folate: 0.6935, dha: 0 }
	],
	potato: [
		{ name: '马铃薯', description: '土豆、洋芋', image: '/static/images/potato.png', energy: 0.8617, protein: 0.0277, fat: 0.0021, carbohydrate: 0.1894, fiber: 0.0117, vitaminA: 0, vitaminB1: 0.0011, vitaminB2: 0.0002, vitaminC: 0.1489, calcium: 0.0745, iron: 0.0043, zinc: 0.0032, selenium: 0.005, folate: 0.1670, dha: 0 }
	],
	bean: [
		{ name: '黄豆', description: '大豆', image: '/static/images/soybean.png', energy: 3.9, protein: 0.35, fat: 0.16, carbohydrate: 0.342, fiber: 0.155, vitaminA: 0, vitaminB1: 0.0041, vitaminB2: 0.002, vitaminC: 0, calcium: 1.91, iron: 0.082, zinc: 0.0334, selenium: 0.0616, folate: 2.101, dha: 0 },
		{ name: '豆腐', description: '豆制品', image: '/static/images/tofu.png', energy: 0.84, protein: 0.066, fat: 0.053, carbohydrate: 0.034, fiber: 0, vitaminA: 0, vitaminB1: 0.0006, vitaminB2: 0.0002, vitaminC: 0, calcium: 0.78, iron: 0.012, zinc: 0.0057, selenium: 0.015, folate: 0.258, dha: 0 }
	],
	vegetable: [
		{ name: '大白菜', description: '常见蔬菜', image: '/static/images/cabbage.png', energy: 0.2247, protein: 0.0180, fat: 0.0022, carbohydrate: 0.0382, fiber: 0.0101, vitaminA: 0, vitaminB1: 0.0006, vitaminB2: 0.0004, vitaminC: 0.4213, calcium: 0.6404, iron: 0.0090, zinc: 0.0052, selenium: 0.0064, folate: 0.2910, dha: 0 }
	],
	fruit: [
		{ name: '苹果', description: '常见水果', image: '/static/images/apple.png', energy: 0.6235, protein: 0.0047, fat: 0.0024, carbohydrate: 0.1612, fiber: 0.0200, vitaminA: 0, vitaminB1: 0.0002, vitaminB2: 0.0002, vitaminC: 0.0353, calcium: 0.0471, iron: 0.0035, zinc: 0.0005, selenium: 0.0012, folate: 0.0741, dha: 0 },
		{ name: '桃', description: '常见水果', image: '/static/images/peach.png', energy: 0.4719, protein: 0.0067, fat: 0.0011, carbohydrate: 0.1135, fiber: 0.0112, vitaminA: 0, vitaminB1: 0.0001, vitaminB2: 0.0002, vitaminC: 0.1124, calcium: 0.0674, iron: 0.0034, zinc: 0.0016, selenium: 0.0053, folate: 0.0337, dha: 0 },
		{ name: '葡萄', description: '常见水果', image: '/static/images/grape.png', energy: 0.5233, protein: 0.0047, fat: 0.0035, carbohydrate: 0.1198, fiber: 0.0116, vitaminA: 0, vitaminB1: 0.0003, vitaminB2: 0.0002, vitaminC: 0.0465, calcium: 0.1047, iron: 0.0047, zinc: 0.0019, selenium: 0.0013, folate: 0.1151, dha: 0 },
		{ name: '橙子', description: '常见水果', image: '/static/images/orange.png', energy: 0.6486, protein: 0.0108, fat: 0.0027, carbohydrate: 0.1500, fiber: 0.0081, vitaminA: 0, vitaminB1: 0.0007, vitaminB2: 0.0005, vitaminC: 0.4459, calcium: 0.2703, iron: 0.0054, zinc: 0.0019, selenium: 0.0042, folate: 0.3568, dha: 0 }
	],
	nut: [
		{ name: '核桃', description: '坚果', image: '/static/images/walnut.png', energy: 15.0233, protein: 0.3465, fat: 1.3674, carbohydrate: 0.4442, fiber: 0.2209, vitaminA: 0, vitaminB1: 0.0035, vitaminB2: 0.0033, vitaminC: 0.0233, calcium: 1.3023, iron: 0.0628, zinc: 0.0505, selenium: 0.1074, folate: 2.3860, dha: 0 },
		{ name: '杏仁', description: '坚果', image: '/static/images/almond.png', energy: 5.7800, protein: 0.2250, fat: 0.4540, carbohydrate: 0.2390, fiber: 0.0800, vitaminA: 0, vitaminB1: 0.0008, vitaminB2: 0.0056, vitaminC: 0.2600, calcium: 0.9700, iron: 0.0220, zinc: 0.0430, selenium: 0.1565, folate: 0.2340, dha: 0 }
	],
	seasoning: [
		{ name: '橄榄油', description: '食用油', image: '/static/images/olive-oil.png', energy: 8.99, protein: 0, fat: 0.999, carbohydrate: 0, fiber: 0, vitaminA: 0, vitaminB1: 0, vitaminB2: 0, vitaminC: 0, calcium: 0, iron: 0.004, zinc: 0, selenium: 0, folate: 0, dha: 0 }
	],
	meat: [
		{ name: '猪肉', description: '畜肉', image: '/static/images/pork.png', energy: 3.6374, protein: 0.1659, fat: 0.3308, carbohydrate: 0, fiber: 0, vitaminA: 0.1648, vitaminB1: 0.0033, vitaminB2: 0.0014, vitaminC: 0, calcium: 0.0659, iron: 0.0143, zinc: 0.0196, selenium: 0.0868, folate: 0, dha: 0 },
		{ name: '猪肝', description: '动物内脏', image: '/static/images/pork-liver.png', energy: 1.26, protein: 0.192, fat: 0.047, carbohydrate: 0.018, fiber: 0, vitaminA: 65.02, vitaminB1: 0.0022, vitaminB2: 0.0202, vitaminC: 0.2, calcium: 0.06, iron: 0.232, zinc: 0.0368, selenium: 0.2612, folate: 0, dha: 0 },
		{ name: '牛肉', description: '畜肉', image: '/static/images/beef.png', energy: 1.6, protein: 0.2, fat: 0.087, carbohydrate: 0.005, fiber: 0, vitaminA: 0.03, vitaminB1: 0.0004, vitaminB2: 0.0011, vitaminC: 0, calcium: 0.05, iron: 0.018, zinc: 0.047, selenium: 0.0315, folate: 0, dha: 0 },
		{ name: '牛肝', description: '动物内脏', image: '/static/images/beef-liver.png', energy: 1.39, protein: 0.198, fat: 0.039, carbohydrate: 0.062, fiber: 0, vitaminA: 202.2, vitaminB1: 0.0016, vitaminB2: 0.013, vitaminC: 0, calcium: 0.04, iron: 0.066, zinc: 0.0501, selenium: 0.1199, folate: 0, dha: 0 },
		{ name: '羊肉', description: '畜肉', image: '/static/images/mutton.png', energy: 1.39, protein: 0.185, fat: 0.065, carbohydrate: 0.016, fiber: 0, vitaminA: 0.08, vitaminB1: 0.0007, vitaminB2: 0.0016, vitaminC: 0, calcium: 0.16, iron: 0.039, zinc: 0.0352, selenium: 0.0595, folate: 0, dha: 0 }
	],
	poultry: [
		{ name: '鸡', description: '禽肉', image: '/static/images/chicken.png', energy: 2.3016, protein: 0.3222, fat: 0.1063, carbohydrate: 0.0143, fiber: 0, vitaminA: 1.4603, vitaminB1: 0.00095, vitaminB2: 0.0011, vitaminC: 0, calcium: 0.2063, iron: 0.0286, zinc: 0.0232, selenium: 0.1892, folate: 0, dha: 0 },
		{ name: '鸭', description: '禽肉', image: '/static/images/duck.png', energy: 3.5294, protein: 0.2279, fat: 0.2897, carbohydrate: 0.0029, fiber: 0, vitaminA: 0.7647, vitaminB1: 0.0012, vitaminB2: 0.0032, vitaminC: 0, calcium: 0.0882, iron: 0.0324, zinc: 0.0196, selenium: 0.1801, folate: 0, dha: 0 },
		{ name: '鹅', description: '禽肉', image: '/static/images/goose.png', energy: 3.9841, protein: 0.2841, fat: 0.3159, carbohydrate: 0, fiber: 0, vitaminA: 0.6667, vitaminB1: 0.0011, vitaminB2: 0.0037, vitaminC: 0, calcium: 0.0635, iron: 0.0603, zinc: 0.0216, selenium: 0.2806, folate: 0, dha: 0 }
	],
	dairy: [
		{ name: '纯牛奶', description: '奶制品', image: '/static/images/milk.png', energy: 0.65, protein: 0.033, fat: 0.036, carbohydrate: 0.049, fiber: 0, vitaminA: 0.54, vitaminB1: 0.0003, vitaminB2: 0.0012, vitaminC: 0, calcium: 1.07, iron: 0.003, zinc: 0.0028, selenium: 0, folate: 0, dha: 0 }
	],
	egg: [
		{ name: '鸡蛋', description: '蛋类', image: '/static/images/egg.png', energy: 1.5977, protein: 0.1506, fat: 0.0989, carbohydrate: 0.0276, fiber: 0, vitaminA: 2.4828, vitaminB1: 0.0010, vitaminB2: 0.0023, vitaminC: 0, calcium: 0.6437, iron: 0.0184, zinc: 0.0102, selenium: 0.1605, folate: 0, dha: 0 },
		{ name: '鸭蛋', description: '蛋类', image: '/static/images/duck-egg.png', energy: 2.0690, protein: 0.1448, fat: 0.1494, carbohydrate: 0.0356, fiber: 0, vitaminA: 3.0, vitaminB1: 0.00195, vitaminB2: 0.00402, vitaminC: 0, calcium: 0.7126, iron: 0.0333, zinc: 0.0192, selenium: 0.1802, folate: 0, dha: 0 }
	],
	seafood: [
		{ name: '草鱼', description: '淡水鱼', image: '/static/images/grass-carp.png', energy: 1.9483, protein: 0.2862, fat: 0.0897, carbohydrate: 0, fiber: 0, vitaminA: 0.1897, vitaminB1: 0.0007, vitaminB2: 0.0019, vitaminC: 0, calcium: 0.6552, iron: 0.0138, zinc: 0.015, selenium: 0.1148, folate: 0, dha: 0 },
		{ name: '基围虾', description: '虾类', image: '/static/images/shrimp.png', energy: 1.6833, protein: 0.3033, fat: 0.0233, carbohydrate: 0.065, fiber: 0, vitaminA: 0, vitaminB1: 0.0003, vitaminB2: 0.0012, vitaminC: 0, calcium: 1.3833, iron: 0.0333, zinc: 0.0197, selenium: 0.6617, folate: 0, dha: 0.68 }
	]
} 