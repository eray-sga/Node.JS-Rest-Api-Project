const User = require('../models/userModel')
var createError = require('http-errors')
const bcrypt = require('bcrypt');

const tumUserlariListele = async (req, res) => {
    const tumUserlar = await User.find({});
    res.json(tumUserlar)
}

const oturumAcanKullaniciBilgileri = (req, res, next) => {
    res.json(req.user)
}

const oturumAcanKullaniciGuncelleme = async (req, res, next) => {

    //değiştirilemeyecek alanları sil
    delete req.body.createdAt;
    delete req.body.updatedAt;
    delete req.body.sifre;

    if(req.body.hasOwnProperty('sifre')){
        req.body.sifre = await bcrypt.hash(req.body.sifre, 10)
    }

    const {error, value} = User.joiValidationForUpdate(req.body);
    if(error){
        next(createError(400, error));
    } else{
        try{
            const sonuc = await User.findByIdAndUpdate({_id:req.user._id}, req.body, {new:true, runValidators:true})
            if(sonuc){
                return res.json({
                    mesaj: "başarıyla güncellendi",
                    sonuc
                })
            } else{
                return res.status(404).json({
                    mesaj: "kullanıcı bulunamadı"
                })
            }
        } catch(e){
            next(e);
        }
    }
    
}

const yeniKullaniciOluturma = async (req, res, next) => {
    
    try{
        const eklenecekUser = new User(req.body);
        eklenecekUser.sifre = await bcrypt.hash(eklenecekUser.sifre, 10);
        const {error, value}  = eklenecekUser.joiValidation(req.body);
        if(error){
            next(createError(400, error));
        } else{
            const sonuc = await eklenecekUser.save()
            res.json(sonuc)
        }
        
    } catch(err) {
        next(err)
    }
    
}

const girisYap = async (req, res, next) => {
    try{

        const user = await User.girisYap(req.body.email, req.body.sifre);
        const token = await user.generateToken()
        res.json({
            user,
            token
        })

    } catch(hata){
        next(hata)
    }
}

const adminUserGuncelleme = async (req, res, next) => {

    //değiştirilemeyecek alanları sil
    delete req.body.createdAt;
    delete req.body.updatedAt;
    delete req.body.sifre;

    if(req.body.hasOwnProperty('sifre')){
        req.body.sifre = await bcrypt.hash(req.body.sifre, 10)
    }

    const {error, value} = User.joiValidationForUpdate(req.body);
    if(error){
        next(createError(400, error));
    } else{
        try{
            const sonuc = await User.findByIdAndUpdate({_id:req.params.id}, req.body, {new:true, runValidators:true})
            if(sonuc){
                return res.json({
                    mesaj: "başarıyla güncellendi",
                    sonuc
                })
            } else{
                return res.status(404).json({
                    mesaj: "kullanıcı bulunamadı"
                })
            }
        } catch(e){
            next(e);
        }
    }
   
}

const tumKullanicilariSil = async (req, res, next) => {
    try{
        const sonuc = await User.deleteMany({isAdmin: false})
        if(sonuc){
            return res.json({
                mesaj: "tüm kullanıcılar silindi" 
            })
        }else{
            throw createError(404, 'kullanıcı bulunamadı')
        }

    } catch(e){

        next(createError(400, e))
    }
    


}

const kullaniciKendiniSil = async (req, res, next) => {
    try{
        const sonuc = await User.findByIdAndDelete({_id:req.user._id})
        if(sonuc){
            return res.json({
                mesaj: "kullanıcı silindi" 
            })
        }else{
            throw createError(404, 'kullanıcı bulunamadı')
        }

    } catch(e){

        next(createError(400, e))
    }
    


}

const yoneticiKullaniciSil = async (req, res, next) => {
    try{
        const sonuc = await User.findByIdAndDelete({_id:req.params.id})
        if(sonuc){
            return res.json({
                mesaj: "kullanıcı silindi" 
            })
        }else{
            throw createError(404, 'kullanıcı bulunamadı')
        }

    } catch(e){

        next(createError(400, e))
    }
    


}

module.exports = {
    tumUserlariListele,
    oturumAcanKullaniciBilgileri,
    oturumAcanKullaniciGuncelleme,
    yeniKullaniciOluturma,
    girisYap,
    adminUserGuncelleme,
    tumKullanicilariSil,
    kullaniciKendiniSil,
    yoneticiKullaniciSil,
}