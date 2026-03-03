require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { sequelize, User, Category, Pet, Service, Product, Review, Notification } = require('../models');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('[Seed] Tables created');

    // ========== Users ==========
    const admin = await User.create({ phone: '13800000001', password: 'admin123', nickname: '管理员', role: 'admin', city: '北京', verified: true });
    const merchant1 = await User.create({ phone: '13800000002', password: '123456', nickname: '宠爱有家', role: 'merchant', city: '北京', verified: true, shop_name: '宠爱有家宠物医院', shop_address: '北京市朝阳区望京街道xx路168号', shop_phone: '010-88888888', latitude: 39.9876, longitude: 116.4741 });
    const merchant2 = await User.create({ phone: '13800000003', password: '123456', nickname: '毛孩子美容', role: 'merchant', city: '北京', verified: true, shop_name: '毛孩子美容工作室', shop_address: '北京市海淀区中关村大街88号', shop_phone: '010-66666666', latitude: 39.9842, longitude: 116.3186 });
    const merchant3 = await User.create({ phone: '13800000004', password: '123456', nickname: '小王', role: 'merchant', city: '北京', verified: false, shop_name: '小王遛狗服务', latitude: 39.9912, longitude: 116.4651 });
    const user1 = await User.create({ phone: '13800000005', password: '123456', nickname: '猫奴小李', city: '北京', points: 280 });
    const user2 = await User.create({ phone: '13800000006', password: '123456', nickname: '狗狗的主人', city: '北京', points: 150 });
    console.log('[Seed] Users created');

    // ========== Categories ==========
    const catData = [
      { name: '宠物买卖', type: 'pet', icon: '🐾', children: ['猫咪', '狗狗', '小型犬', '大型犬', '异宠', '水族', '鸟类', '领养'] },
      { name: '医疗服务', type: 'service', icon: '🏥', children: ['疫苗接种', '体检套餐', '绝育手术', '牙齿护理', '皮肤病', '在线问诊'] },
      { name: '宠物美容', type: 'service', icon: '✂️', children: ['洗澡', '修剪造型', 'SPA护理', '染色', '清洁护理'] },
      { name: '寄养托管', type: 'service', icon: '🏠', children: ['家庭寄养', '机构寄养', '日托', '长期寄养'] },
      { name: '遛狗/喂养', type: 'service', icon: '🦮', children: ['遛狗', '上门喂养', '上门喂猫', '定期照看'] },
      { name: '宠物训练', type: 'service', icon: '🎓', children: ['基础训练', '行为纠正', '特技训练', '社会化训练'] },
      { name: '宠物托运', type: 'service', icon: '✈️', children: ['航空托运', '陆运', '同城接送'] },
      { name: '宠物殡葬', type: 'service', icon: '🕊️', children: ['火化服务', '纪念服务', '树葬'] },
      { name: '用品商城', type: 'product', icon: '🛒', children: ['猫粮', '狗粮', '零食', '玩具', '日用品', '保健品'] },
    ];

    for (let i = 0; i < catData.length; i++) {
      const parent = await Category.create({ name: catData[i].name, type: catData[i].type, icon: catData[i].icon, sort_order: i });
      for (let j = 0; j < catData[i].children.length; j++) {
        await Category.create({ name: catData[i].children[j], type: catData[i].type, parent_id: parent.id, sort_order: j });
      }
    }
    console.log('[Seed] Categories created');

    // ========== Pets ==========
    const pets = [
      { user_id: user1.id, category_id: 2, title: '纯种金毛幼犬 已打疫苗 健康保障', breed: '金毛寻回犬', age: '3个月', gender: 'male', vaccine: '已打2针', deworming: '已驱虫', price: 2800, description: '自家繁殖的纯种金毛幼犬，父母都是冠军血统，性格温顺，聪明活泼。', images: '[]', contact: '13800000005', city: '北京', address: '朝阳区', status: 'active', view_count: 326 },
      { user_id: user2.id, category_id: 1, title: '英短蓝猫 2个月 纯种带证', breed: '英国短毛猫', age: '2个月', gender: 'female', vaccine: '已打1针', deworming: '已驱虫', price: 3500, description: '纯种英短蓝猫，品相好，性格亲人。', images: '[]', contact: '13800000006', city: '北京', address: '海淀区', status: 'active', view_count: 213 },
      { user_id: user1.id, category_id: 2, title: '柯基犬 4个月 健康保障', breed: '威尔士柯基', age: '4个月', gender: 'male', vaccine: '已打3针', deworming: '已驱虫', price: 4200, description: '小短腿柯基，活泼好动，已完成疫苗。', images: '[]', contact: '13800000005', city: '北京', address: '西城区', status: 'active', view_count: 189 },
      { user_id: user2.id, category_id: 1, title: '布偶猫 3个月 仙女猫带证', breed: '布偶猫', age: '3个月', gender: 'female', vaccine: '已打2针', deworming: '已驱虫', price: 5800, description: '高品质布偶猫，蓝双色，性格温顺粘人。', images: '[]', contact: '13800000006', city: '北京', address: '东城区', status: 'active', view_count: 445 },
      { user_id: merchant3.id, category_id: 2, title: '拉布拉多幼犬 疫苗齐全', breed: '拉布拉多', age: '3个月', gender: 'male', vaccine: '已打3针', deworming: '已驱虫', price: 3000, description: '性格温顺的拉布拉多，适合家庭饲养。', images: '[]', contact: '13800000004', city: '北京', address: '丰台区', status: 'active', view_count: 167 },
    ];
    for (const p of pets) await Pet.create(p);
    console.log('[Seed] Pets created');

    // ========== Services ==========
    const services = [
      { user_id: merchant1.id, category_id: 10, title: '宠爱有家宠物医院', service_type: '宠物医疗', description: '专业综合性宠物医院，拥有先进医疗设备和经验丰富的兽医团队。', price_min: 58, price_max: 580, price_list: JSON.stringify([{name:'基础体检',desc:'身体检查、听诊、触诊',price:58},{name:'猫三联疫苗',desc:'进口疫苗，含注射费',price:120},{name:'犬四联疫苗',desc:'进口疫苗，含注射费',price:138},{name:'绝育手术(猫)',desc:'含术前检查、麻醉、手术',price:580},{name:'洁牙套餐',desc:'超声波洁牙+抛光',price:388}]), contact: '010-88888888', business_hours: '09:00 - 21:00', city: '北京', address: '朝阳区望京街道xx路168号', latitude: 39.9876, longitude: 116.4741, rating: 4.9, review_count: 256, order_count: 1203, status: 'active', view_count: 5432 },
      { user_id: merchant2.id, category_id: 14, title: '毛孩子美容工作室', service_type: '宠物美容', description: '专业宠物美容，提供洗澡、造型、SPA等服务。', price_min: 68, price_max: 388, price_list: JSON.stringify([{name:'猫咪洗澡',desc:'含吹干、梳理',price:68},{name:'狗狗洗澡(小)',desc:'10kg以下',price:78},{name:'狗狗洗澡(大)',desc:'10kg以上',price:118},{name:'造型修剪',desc:'含洗澡+造型',price:168},{name:'SPA套餐',desc:'洗澡+按摩+护理',price:288}]), contact: '010-66666666', business_hours: '10:00 - 20:00', city: '北京', address: '海淀区中关村大街88号', latitude: 39.9842, longitude: 116.3186, rating: 4.8, review_count: 189, order_count: 876, status: 'active', view_count: 3211 },
      { user_id: merchant3.id, category_id: 22, title: '小王遛狗服务', service_type: '遛狗', description: '专业遛狗服务，有爱心有经验，覆盖朝阳区。', price_min: 30, price_max: 80, price_list: JSON.stringify([{name:'日常遛狗(30分钟)',desc:'每次30分钟',price:30},{name:'日常遛狗(60分钟)',desc:'每次60分钟',price:50},{name:'上门喂养',desc:'每次上门30分钟',price:40}]), contact: '13800000004', business_hours: '08:00 - 20:00', city: '北京', address: '朝阳区', latitude: 39.9912, longitude: 116.4651, rating: 4.7, review_count: 45, order_count: 234, status: 'active', view_count: 1234 },
      { user_id: merchant1.id, category_id: 18, title: '萌宠乐园寄养中心', service_type: '寄养托管', description: '专业宠物寄养中心，独立房间，24小时监控，每日照片汇报。', price_min: 88, price_max: 168, price_list: JSON.stringify([{name:'猫咪日托',desc:'白天照看',price:58},{name:'猫咪寄养(天)',desc:'独立房间，每日汇报',price:88},{name:'狗狗日托',desc:'白天照看+遛狗',price:78},{name:'狗狗寄养(天)',desc:'独立房间+每日遛狗',price:128}]), contact: '010-88888888', business_hours: '08:00 - 22:00', city: '北京', address: '朝阳区望京南路100号', latitude: 39.9812, longitude: 116.4632, rating: 4.9, review_count: 312, order_count: 1567, status: 'active', view_count: 4321 },
    ];
    for (const s of services) await Service.create(s);
    console.log('[Seed] Services created');

    // ========== Products ==========
    const products = [
      { user_id: merchant1.id, category_id: 37, title: '皇家猫粮 成猫通用型 室内猫粮 2kg', description: '专为室内成猫设计，富含优质蛋白质和膳食纤维。', price: 89, original_price: 128, specs: JSON.stringify([{name:'2kg装'},{name:'4kg装'},{name:'10kg装'}]), stock: 368, sales: 2345, status: 'active', rating: 4.8, review_count: 156, view_count: 5678 },
      { user_id: merchant1.id, category_id: 38, title: '冠能狗粮 中大型成犬粮 15kg', description: '专为中大型成犬研制，高蛋白配方。', price: 198, original_price: 258, specs: JSON.stringify([{name:'5kg装'},{name:'15kg装'}]), stock: 156, sales: 1234, status: 'active', rating: 4.7, review_count: 89, view_count: 3456 },
      { user_id: merchant2.id, category_id: 39, title: '猫咪冻干零食 鸡胸肉 100g', description: '纯肉冻干，无添加，猫咪最爱的零食。', price: 29, original_price: 39, specs: JSON.stringify([{name:'100g'},{name:'200g'}]), stock: 520, sales: 4567, status: 'active', rating: 4.9, review_count: 234, view_count: 7890 },
      { user_id: merchant2.id, category_id: 40, title: '猫咪逗猫棒 电动玩具套装', description: '自动逗猫棒+羽毛替换头，解放双手。', price: 35, original_price: 59, specs: JSON.stringify([{name:'基础款'},{name:'豪华套装'}]), stock: 234, sales: 890, status: 'active', rating: 4.6, review_count: 67, view_count: 2345 },
      { user_id: merchant1.id, category_id: 41, title: '宠物自动饮水机 2.5L大容量', description: '静音循环过滤，让宠物爱上喝水。', price: 79, original_price: 119, specs: JSON.stringify([{name:'白色'},{name:'粉色'}]), stock: 189, sales: 567, status: 'active', rating: 4.8, review_count: 45, view_count: 1890 },
    ];
    for (const p of products) await Product.create(p);
    console.log('[Seed] Products created');

    // ========== Reviews ==========
    const reviews = [
      { user_id: user1.id, target_type: 'service', target_id: 1, rating: 5, content: '带猫咪来打疫苗，医生很专业很耐心。环境干净，推荐！' },
      { user_id: user2.id, target_type: 'service', target_id: 1, rating: 5, content: '体检很仔细，医生还给了很多养宠建议，价格也合理。' },
      { user_id: user1.id, target_type: 'service', target_id: 2, rating: 4, content: '猫咪洗得很干净，造型也不错，就是等的时间有点长。' },
      { user_id: user2.id, target_type: 'product', target_id: 1, rating: 5, content: '猫咪很喜欢吃，毛发也变得更有光泽了。' },
      { user_id: user1.id, target_type: 'product', target_id: 3, rating: 5, content: '纯肉冻干，猫咪超爱！每次一拿出来就飞奔过来。' },
    ];
    for (const r of reviews) await Review.create(r);
    console.log('[Seed] Reviews created');

    // ========== Notifications ==========
    await Notification.create({ user_id: user1.id, type: 'system', title: '欢迎加入宠我吧', content: '恭喜你成为宠我吧的一员！新用户注册即送50元优惠券。' });
    await Notification.create({ user_id: user1.id, type: 'system', title: '完善资料有奖', content: '完善个人资料可获得100积分奖励。' });
    console.log('[Seed] Notifications created');

    console.log('\n========================================');
    console.log('  Seed completed successfully!');
    console.log('========================================');
    console.log('\nTest accounts:');
    console.log('  Admin:    13800000001 / admin123');
    console.log('  Merchant: 13800000002 / 123456');
    console.log('  Merchant: 13800000003 / 123456');
    console.log('  Merchant: 13800000004 / 123456');
    console.log('  User:     13800000005 / 123456');
    console.log('  User:     13800000006 / 123456\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error:', err);
    process.exit(1);
  }
};

seed();
