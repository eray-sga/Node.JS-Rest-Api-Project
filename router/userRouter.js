const router = require("express").Router();
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware');
const userController = require('../controllers/userController')

//tüm kullanıcıları admin listeleyebilir
router.get('/', [authMiddleware, adminMiddleware], userController.tumUserlariListele)

//oturum açan kullanıcı kendi bilgilerini listeleyebilir
router.get('/me', authMiddleware, userController.oturumAcanKullaniciBilgileri)

//oturum açan kullanıcı kendi bilgilerini güncelleyebilir
router.patch('/me', authMiddleware, userController.oturumAcanKullaniciGuncelleme)

router.post('/', userController.yeniKullaniciOluturma)

router.post('/giris', userController.girisYap)

router.patch('/:id', userController.adminUserGuncelleme)

//kullanıcı kendini silecek
router.delete('/me', authMiddleware, userController.kullaniciKendiniSil)

//admin kullanıcıları silebilecek
router.delete('/:id', [authMiddleware, adminMiddleware], userController.yoneticiKullaniciSil)

//admin yetkisi olmayan herkesi silebilecek
router.get('/deleteAll', [authMiddleware, adminMiddleware], userController.tumKullanicilariSil)

module.exports = router;
