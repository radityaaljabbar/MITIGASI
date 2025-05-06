const {pool} = require('../config/database')
const response = require('../utils/response')
const responseDosWalModel = require('../models/responseDosenWali')

exports.getKeluhanMahasiswa = async (req, res, next) => {
    const dosenNIP = req.user.id
    

    try {
        const [data] = await (responseDosWalModel.getKeluhan(dosenNIP))
        console.log(dosenNIP)
        response(200, data, "dapat semua keluhan", res)
    } catch (err) {
        if(err) throw err;
        response(500, null, "tidak dapat mengambil data keluhan mahasiswa wali", res)
    }
}

exports.getResponDosWal = async (req, res, next) => {
    const dosenNIP = req.user.id

    try {
        const [data] = await (responseDosWalModel.getResponse(dosenNIP))
        console.log(dosenNIP)
        response(200, data, "dapat semua response", res)
    } catch (err) {
        if(err) throw err;
        response(500, null, "tidak dapat mengambil data response dosen wali", res)
    }
}
