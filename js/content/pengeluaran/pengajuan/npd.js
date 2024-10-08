function singkron_npd_lokal(){
    jQuery('#wrap-loading').show();
    get_npd({data: []})
    .then(function(npd_all){
  		// alert('Berhasil singkron NPD ke lokal!');
  		jQuery('#wrap-loading').hide();
    })
}


function get_npd(opsi, page=1, limit=50){

  console.log('ini halaman page ya ',page);

	return new Promise(function(resolve, reject){
		var status = 'validasi';
		pesan_loading('Get data NPD, status='+status+', page='+page);
	    relayAjaxApiKey({
			// https://service.sipd.kemendagri.go.id/pengeluaran/strict/npd/index/2973?page=1&limit=10&status=validasi&jenis_npd=0&kondisi_selesai=4
      // url: config.service_url+'pengeluaran/strict/npd/index/'+_token.id_skpd+'?page='+page+'&limit='+limit+'&status='+status+'&jenis_npd=0&kondisi_selesai=4',
			url: config.service_url+'pengeluaran/strict/npd/index?page='+page+'&limit='+limit+'&status='+status+'&jenis_npd=0&kondisi_selesai=4',
			type: 'get',
			success: function(data_npd){
					var last = data_npd.length-1;
					data_npd.reduce(function(sequence, nextData){
			            return sequence.then(function(current_data){
							var npd = {
								action: "singkron_npd",
								tahun_anggaran: _token.tahun,
								api_key: config.api_key,
								idSkpd: current_data.id_skpd,
								sumber: 'ri',
								page: current_data.page,
								data: {},
								page: page,
						  };
						  	npd.data[0] = {}
							npd.data[0].id_npd = current_data.id_npd;
							npd.data[0].nomor_npd = current_data.nomor_npd;
							npd.data[0].tahun = current_data.tahun;
							npd.data[0].id_daerah = _token.id_daerah;
							npd.data[0].id_unit = current_data.id_unit;
							npd.data[0].id_skpd = current_data.id_skpd;
							npd.data[0].nilai_npd = current_data.nilai_npd;
							npd.data[0].nilai_npd_disetujui = current_data.nilai_npd_disetujui;
							npd.data[0].nilai_npd = current_data.nilai_npd;
							npd.data[0].tanggal_npd = current_data.tanggal_npd;
							npd.data[0].tanggal_npd_selesai = current_data.tanggal_npd_selesai;
							npd.data[0].keterangan_npd = current_data.keterangan_npd;
							npd.data[0].is_verifikasi_npd = current_data.is_verifikasi_npd;
							npd.data[0].verifikasi_npd_at = current_data.verifikasi_npd_at;
							npd.data[0].verifikasi_npd_by = current_data.verifikasi_npd_by;
							npd.data[0].nomor_verifikasi = current_data.nomor_verifikasi;
							npd.data[0].is_npd_panjar = current_data.is_npd_panjar;
							npd.data[0].kondisi_selesai = current_data.kondisi_selesai;
							npd.data[0].selesai_at = current_data.selesai_at;
							npd.data[0].selesai_by = current_data.selesai_by;
							npd.data[0].nomor_selesai = current_data.nomor_selesai;
							npd.data[0].nilai_pengembalian = current_data.nilai_pengembalian;
							npd.data[0].nilai_kurang_bayar = current_data.nilai_kurang_bayar;
							npd.data[0].nomor_kurang_lebih = current_data.nomor_kurang_lebih;
							npd.data[0].kurang_lebih_at = current_data.kurang_lebih_at;
							npd.data[0].kurang_lebih_by = current_data.kurang_lebih_by;
							npd.data[0].is_validasi_npd = current_data.is_validasi_npd;
							npd.data[0].validasi_npd_at = current_data.validasi_npd_at;
							npd.data[0].validasi_npd_by = current_data.validasi_npd_by;
							npd.data[0].is_tbp = current_data.is_tbp;
							npd.data[0].tbp_at = current_data.tbp_at;
							npd.data[0].tbp_by = current_data.tbp_by;
							npd.data[0].id_jadwal = current_data.id_jadwal;
							npd.data[0].id_tahap = current_data.id_tahap;
							npd.data[0].status_tahap = current_data.status_tahap;
							npd.data[0].kode_tahap = current_data.kode_tahap;
							npd.data[0].created_at = current_data.created_at;
							npd.data[0].created_by = current_data.created_by;
							npd.data[0].updated_at = current_data.updated_at;
							npd.data[0].updated_by = current_data.updated_by;
							npd.data[0].deleted_at = current_data.deleted_at;
							npd.data[0].deleted_by = current_data.deleted_by;
							npd.data[0].kode_skpd = current_data.kode_skpd;
							npd.data[0].nama_skpd = current_data.nama_skpd;
							npd.data[0].kode_sub_skpd = current_data.kode_sub_skpd;
							npd.data[0].nama_sub_skpd = current_data.nama_sub_skpd;
							npd.data[0].total_pertanggungjawaban = current_data.total_pertanggungjawaban;
						  var data_back = {
								message: {
								  type: "get-url",
								  content: {
										url: config.url_server_lokal+'/npd',
										type: "post",
										data: npd,
										return: false
								  },
								},
						  };
						  chrome.runtime.sendMessage(data_back, (resp) => {
							pesan_loading("Kirim data NPD ID SKPD="+current_data.id_skpd+" status="+status+" nomor="+current_data.nomor_npd+" halaman="+page);
						  });
			        		return new Promise(function(resolve_reduce, reject_reduce){
			        			relayAjaxApiKey({
									url: config.service_url + "pengeluaran/strict/npd/cetak/" + current_data.id_npd,
									type: 'get',
									dataType: "JSON",
									beforeSend: function (xhr) {
										xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
									},
									success: function (res) {
										console.log('response detail npd', res);
										pesan_loading("Kirim data NPD detail ID="+current_data.id_npd+" halaman="+page);
										// var tbp_detail = {
										// 	action: "singkron_tbp_detail",
										// 	tahun_anggaran: _token.tahun,
										// 	api_key: config.api_key,
										// 	idSkpd: current_data.id_skpd,
										// 	id_tbp: current_data.id_tbp,
										// 	jenis: current_data.jenis_tbp,
										// 	sumber: 'ri',
										// 	data: res
										// };
										res.idSkpd = current_data.id_skpd;
										res.id_npd = current_data.id_npd;
										opsi.data.push(res);
                    setTimeout(() => {
                        resolve_reduce(nextData);
                    }, 2000)

									},
									error: function(err){
										console.log('Error get detail NPD! id='+current_data.id_npd, err);
										resolve();
									}
								});
			        		})
			                .catch(function(e){
			                    console.log(e);
			                    return Promise.resolve(nextData);
			                });
			            })
			            .catch(function(e){
			                console.log(e);
			                return Promise.resolve(nextData);
			            });
			        }, Promise.resolve(data_npd[last]))
			        .then(function(data_last){
			        	var data_back = {
						    message:{
						        type: "get-url",
						        content: {
								    url: config.url_server_lokal+'/npd_cetak',
								    type: 'post',
								    data: {
										action: 'singkron_npd_detail',
										tahun_anggaran: _token.tahun,
										api_key: config.api_key,
										type: 'ri',
										data: opsi.data
									},
					    			return: false
								}
						    }
						};
						chrome.runtime.sendMessage(data_back, function(response) {
						    console.log('responeMessage', response);
						});

						if(data_npd.length >= limit){

    							// dikosongkan lagi setelah data dikirim ke lokal
    							opsi.data = [];
    							page++;
                  console.log('page ke dua ',page);

                  // edit disini ya
                  if(page <= 20){
        							get_npd(opsi, page, limit)
        							.then(function(newdata){
        								resolve(newdata);
        							});
                  }else{
                      resolve(opsi.data)
                  }

						}else{
							resolve(opsi.data);
						}
			        });

			}
		});
	});
}


function get_backup_npd(opsi, page=1, limit=50){
	return new Promise(function(resolve, reject){
		var status = 'validasi';
		pesan_loading('Get data NPD, status='+status+', page='+page);
	    relayAjaxApiKey({
			// https://service.sipd.kemendagri.go.id/pengeluaran/strict/npd/index/2973?page=1&limit=10&status=validasi&jenis_npd=0&kondisi_selesai=4
      // url: config.service_url+'pengeluaran/strict/npd/index/'+_token.id_skpd+'?page='+page+'&limit='+limit+'&status='+status+'&jenis_npd=0&kondisi_selesai=4',
			url: config.service_url+'pengeluaran/strict/npd/index/'+_token.id_skpd+'?page='+page+'&limit='+limit+'&status='+status+'&jenis_npd=0&kondisi_selesai=4',
			type: 'get',
			success: function(data_npd){
					var last = data_npd.length-1;
					data_npd.reduce(function(sequence, nextData){
			            return sequence.then(function(current_data){
							var npd = {
								action: "singkron_npd",
								tahun_anggaran: _token.tahun,
								api_key: config.api_key,
								idSkpd: current_data.id_skpd,
								sumber: 'ri',
								page: current_data.page,
								data: {},
								page: page,
						  };
						  	npd.data[0] = {}
							npd.data[0].id_npd = current_data.id_npd;
							npd.data[0].nomor_npd = current_data.nomor_npd;
							npd.data[0].tahun = current_data.tahun;
							npd.data[0].id_daerah = _token.id_daerah;
							npd.data[0].id_unit = current_data.id_unit;
							npd.data[0].id_skpd = current_data.id_skpd;
							npd.data[0].nilai_npd = current_data.nilai_npd;
							npd.data[0].nilai_npd_disetujui = current_data.nilai_npd_disetujui;
							npd.data[0].nilai_npd = current_data.nilai_npd;
							npd.data[0].tanggal_npd = current_data.tanggal_npd;
							npd.data[0].tanggal_npd_selesai = current_data.tanggal_npd_selesai;
							npd.data[0].keterangan_npd = current_data.keterangan_npd;
							npd.data[0].is_verifikasi_npd = current_data.is_verifikasi_npd;
							npd.data[0].verifikasi_npd_at = current_data.verifikasi_npd_at;
							npd.data[0].verifikasi_npd_by = current_data.verifikasi_npd_by;
							npd.data[0].nomor_verifikasi = current_data.nomor_verifikasi;
							npd.data[0].is_npd_panjar = current_data.is_npd_panjar;
							npd.data[0].kondisi_selesai = current_data.kondisi_selesai;
							npd.data[0].selesai_at = current_data.selesai_at;
							npd.data[0].selesai_by = current_data.selesai_by;
							npd.data[0].nomor_selesai = current_data.nomor_selesai;
							npd.data[0].nilai_pengembalian = current_data.nilai_pengembalian;
							npd.data[0].nilai_kurang_bayar = current_data.nilai_kurang_bayar;
							npd.data[0].nomor_kurang_lebih = current_data.nomor_kurang_lebih;
							npd.data[0].kurang_lebih_at = current_data.kurang_lebih_at;
							npd.data[0].kurang_lebih_by = current_data.kurang_lebih_by;
							npd.data[0].is_validasi_npd = current_data.is_validasi_npd;
							npd.data[0].validasi_npd_at = current_data.validasi_npd_at;
							npd.data[0].validasi_npd_by = current_data.validasi_npd_by;
							npd.data[0].is_tbp = current_data.is_tbp;
							npd.data[0].tbp_at = current_data.tbp_at;
							npd.data[0].tbp_by = current_data.tbp_by;
							npd.data[0].id_jadwal = current_data.id_jadwal;
							npd.data[0].id_tahap = current_data.id_tahap;
							npd.data[0].status_tahap = current_data.status_tahap;
							npd.data[0].kode_tahap = current_data.kode_tahap;
							npd.data[0].created_at = current_data.created_at;
							npd.data[0].created_by = current_data.created_by;
							npd.data[0].updated_at = current_data.updated_at;
							npd.data[0].updated_by = current_data.updated_by;
							npd.data[0].deleted_at = current_data.deleted_at;
							npd.data[0].deleted_by = current_data.deleted_by;
							npd.data[0].kode_skpd = current_data.kode_skpd;
							npd.data[0].nama_skpd = current_data.nama_skpd;
							npd.data[0].kode_sub_skpd = current_data.kode_sub_skpd;
							npd.data[0].nama_sub_skpd = current_data.nama_sub_skpd;
							npd.data[0].total_pertanggungjawaban = current_data.total_pertanggungjawaban;
						  var data_back = {
								message: {
								  type: "get-url",
								  content: {
										url: config.url_server_lokal,
										type: "post",
										data: npd,
										return: false
								  },
								},
						  };
						  chrome.runtime.sendMessage(data_back, (resp) => {
							pesan_loading("Kirim data NPD ID SKPD="+current_data.id_skpd+" status="+status+" nomor="+current_data.nomor_npd+" halaman="+page);
						  });
			        		return new Promise(function(resolve_reduce, reject_reduce){
			        			relayAjaxApiKey({
									url: config.service_url + "pengeluaran/strict/npd/cetak/" + current_data.id_npd,
									type: 'get',
									dataType: "JSON",
									beforeSend: function (xhr) {
										xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
									},
									success: function (res) {
										console.log('response detail npd', res);
										pesan_loading("Kirim data NPD detail ID="+current_data.id_npd+" halaman="+page);
										// var tbp_detail = {
										// 	action: "singkron_tbp_detail",
										// 	tahun_anggaran: _token.tahun,
										// 	api_key: config.api_key,
										// 	idSkpd: current_data.id_skpd,
										// 	id_tbp: current_data.id_tbp,
										// 	jenis: current_data.jenis_tbp,
										// 	sumber: 'ri',
										// 	data: res
										// };
										res.idSkpd = current_data.id_skpd;
										res.id_npd = current_data.id_npd;
										opsi.data.push(res);
										resolve_reduce(nextData);
									},
									error: function(err){
										console.log('Error get detail NPD! id='+current_data.id_npd, err);
										resolve();
									}
								});
			        		})
			                .catch(function(e){
			                    console.log(e);
			                    return Promise.resolve(nextData);
			                });
			            })
			            .catch(function(e){
			                console.log(e);
			                return Promise.resolve(nextData);
			            });
			        }, Promise.resolve(data_npd[last]))
			        .then(function(data_last){
			        	var data_back = {
						    message:{
						        type: "get-url",
						        content: {
								    url: config.url_server_lokal,
								    type: 'post',
								    data: {
										action: 'singkron_npd_detail',
										tahun_anggaran: _token.tahun,
										api_key: config.api_key,
										type: 'ri',
										data: opsi.data
									},
					    			return: false
								}
						    }
						};
						chrome.runtime.sendMessage(data_back, function(response) {
						    console.log('responeMessage', response);
						});

						if(data_npd.length >= limit){
							// dikosongkan lagi setelah data dikirim ke lokal
							opsi.data = [];
							page++;
							get_npd(opsi, page, limit)
							.then(function(newdata){
								resolve(newdata);
							});
						}else{
							resolve(opsi.data);
						}
			        });

			}
		});
	});
}
