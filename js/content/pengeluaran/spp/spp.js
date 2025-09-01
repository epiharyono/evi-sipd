function singkron_spp_lokal(val, type_data, page=1,response_all=[]) {
	jQuery('#wrap-loading').show();
	// status = draft , diterima , dihapus , ditolak
	var status = val;
	pesan_loading('Get data SPP jenis='+type_data+' , status='+status+', halaman='+page);
	return new Promise(function(resolve, reduce){
		relayAjaxApiKey({
				// url: config.service_url+'pengeluaran/strict/spp/pembuatan/index?jenis='+type_data+'&status='+status+'&page='+page,

	  		url: config.service_url+'pengeluaran/strict/spp/pembuatan/index?status='+status+'&page='+page,
		  	type: 'get',
		  	success: function (response) {
				console.log('SPP', response);
				if(response!=null && response.length >= 1){
					response.map(function(b, i){
						response_all.push(b);
					})

					if(page <= 1000){
							setTimeout(() => {
									console.log('ini post_spp_localdb : '+page);
									singkron_spp_lokal(val, type_data, page+1, response_all);
									return resolve();
							}, 2000)
					}else{
							post_spp_localdb(response_all);
							let respx = []
							// singkron_spp_lokal(val, type_data, 1, respx);
							// return resolve();
					}

				}else{
					var page_skpd = {};
					var last = response_all.length-1;
					response_all.reduce(function (sequence, nextData) {
					  	return sequence.then(function (current_data) {
							return new Promise(function (resolve_reduce, reject_reduce) {
								pesan_loading('Get SPP '+type_data+' dari ID SKPD "'+current_data.id_skpd+'"');
								if(!page_skpd[current_data.id_skpd]){
									page_skpd[current_data.id_skpd] = [];
								}
								page_skpd[current_data.id_skpd].push(current_data);

								// melakukan reset page sesuai data per skpd
								current_data.page = page_skpd[current_data.id_skpd].length;

								singkron_spp_ke_lokal_skpd(current_data, type_data, status, ()=>{
									resolve_reduce(nextData);
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
					}, Promise.resolve(response_all[last]))
					.then(function (data_last) {
					  	jQuery("#wrap-loading").hide();
					  	return resolve();
					});
				}
		  	},
		});
	});
}

function singkron_spp_search_lokal(val, type_data, page=1, search, response_all=[]) {
	jQuery('#wrap-loading').show();
	// status = draft , diterima , dihapus , ditolak
	var status = val;
	pesan_loading('Get data SPP jenis='+type_data+' , status='+status+', halaman='+page);
	return new Promise(function(resolve, reduce){
		relayAjaxApiKey({
				// url: config.service_url+'pengeluaran/strict/spp/pembuatan/index?jenis='+type_data+'&status='+status+'&page='+page,

	  		url: config.service_url+'pengeluaran/strict/spp/pembuatan/index?status='+status+'&page='+page+'&nomor_spp='+search,
		  	type: 'get',
		  	success: function (response) {
				console.log('SPP', response);
				if(response!=null && response.length >= 1){
						response.map(function(b, i){
							response_all.push(b);
						})


						singkron_spp_search_lokal(val, type_data, page+1, search, response_all);
						return resolve();

					}else{
							post_spp_localdb(response_all);
					}
		  	},
		});
	});
}


async function post_spp_localdb(response){
		response.map(function(b, i){
				// baru yasmin caca
				setTimeout(() => {
							singkron_spp_ke_lokal_skpd(b, 'type_data', 'status', ()=>{
								resolve_reduce(nextData);
							});

							singkron_spp_cetak_ke_lokal_skpd(b, 'type_data', 'status', ()=>{
								resolve_reduce(nextData);
							});

							console.log('ini post_spp_localdb : '+i, b);
				}, 2500 * i)
		})

}

function singkron_spp_ke_lokal_skpd(current_data, tipe, status, callback) {
	var spp = {
	  	action: "singkron_spp",
	  	tahun_anggaran: _token.tahun,
	  	api_key: config.api_key,
	  	idSkpd: current_data.id_skpd,
	  	tipe: tipe,
	  	sumber: 'ri',
	  	page: current_data.page,
	 	data: {}
	};
	spp.data[0] = {}
	spp.data[0].id_spp = current_data.id_spp;
	spp.data[0].bulan_gaji = current_data.bulan_gaji;
	spp.data[0].bulan_tpp = current_data.bulan_tpp;
	spp.data[0].created_at = current_data.created_at;
	spp.data[0].created_by = current_data.created_by;
	spp.data[0].deleted_at = current_data.deleted_at;
	spp.data[0].deleted_by = current_data.deleted_by;
	spp.data[0].details = current_data.details;
	spp.data[0].id_ba = current_data.id_ba;
	spp.data[0].id_daerah = current_data.id_daerah;
	spp.data[0].id_jadwal = current_data.id_jadwal;
	spp.data[0].id_kontrak = current_data.id_kontrak;
	spp.data[0].id_lpj_gu = current_data.id_lpj_gu;
	spp.data[0].id_pegawai_pa_kpa = current_data.id_pegawai_pa_kpa;
	spp.data[0].id_pegawai_pptk = current_data.id_pegawai_pptk;
	spp.data[0].id_pengajuan_tu = current_data.id_pengajuan_tu;
	spp.data[0].id_skpd = current_data.id_skpd;
	spp.data[0].id_sub_skpd = current_data.id_sub_skpd;
	spp.data[0].id_sumber_dana = current_data.id_sumber_dana;
	spp.data[0].id_tahap = current_data.id_tahap;
	spp.data[0].id_unit = current_data.id_unit;
	spp.data[0].is_gaji = current_data.is_gaji;
	spp.data[0].is_kunci_rekening_spp = current_data.is_kunci_rekening_spp;
	spp.data[0].is_rekanan_upload = current_data.is_rekanan_upload;
	spp.data[0].is_spm = current_data.is_spm;
	spp.data[0].is_status_perubahan = current_data.is_status_perubahan;
	spp.data[0].is_tpp = current_data.is_tpp;
	spp.data[0].is_verifikasi_spp = current_data.is_verifikasi_spp;
	spp.data[0].jenis_gaji = current_data.jenis_gaji;
	spp.data[0].jenis_ls_spp = current_data.jenis_ls_spp;
	spp.data[0].jenis_spp = current_data.jenis_spp;
	spp.data[0].keterangan_spp = current_data.keterangan_spp;
	spp.data[0].keterangan_verifikasi_spp = current_data.keterangan_verifikasi_spp;
	spp.data[0].kode_tahap = current_data.kode_tahap;
	spp.data[0].nilai_materai_spp = current_data.nilai_materai_spp;
	spp.data[0].nilai_spp = current_data.nilai_spp;
	spp.data[0].nilai_verifikasi_spp = current_data.nilai_verifikasi_spp;
	spp.data[0].nomor_spp = current_data.nomor_spp;
	spp.data[0].rekanan_nama_perusahaan = current_data.rekanan_nama_perusahaan;
	spp.data[0].rekanan_nama_rekening = current_data.rekanan_nama_rekening;
	spp.data[0].rekanan_nama_tujuan = current_data.rekanan_nama_tujuan;
	spp.data[0].rekanan_nik = current_data.rekanan_nik;
	spp.data[0].rekanan_nomor_rekening = current_data.rekanan_nomor_rekening;
	spp.data[0].status_perubahan_at = current_data.status_perubahan_at;
	spp.data[0].status_perubahan_by = current_data.status_perubahan_by;
	spp.data[0].status_tahap = current_data.status_tahap;
	spp.data[0].tahun = current_data.tahun;
	spp.data[0].tahun_gaji = current_data.tahun_gaji;
	spp.data[0].tahun_tpp = current_data.tahun_tpp;
	spp.data[0].tanggal_spp = current_data.tanggal_spp;
	spp.data[0].updated_at = current_data.updated_at;
	spp.data[0].updated_by = current_data.updated_by;
	spp.data[0].verifikasi_spp_at = current_data.verifikasi_spp_at;
	spp.data[0].verifikasi_spp_by = current_data.verifikasi_spp_by;

	var data_back = {
	 	 message: {
			type: "get-url",
			content: {
			  	url: config.url_server_lokal+'/spp',
			  	type: "post",
			  	data: spp,
			  	return: false
			},
	  	},
	};
	chrome.runtime.sendMessage(data_back, (resp) => {
	  	pesan_loading("Kirim data SPP ID SKPD="+current_data.id_skpd+" tipe="+tipe+" status="+status+" nomor="+current_data.nomor_spp);
	});
	if(tipe == 'UP'){
		return callback();
	}

	// new Promise(function (resolve, reject) {
	// 	jQuery.ajax({
	// 		url: config.service_url + "pengeluaran/strict/spp/pembuatan/cetak/" + current_data.id_spp,
	// 		type: 'get',
	// 		dataType: "JSON",
	// 		beforeSend: function (xhr) {
	// 			xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
	// 		},
	// 		success: function (res) {
	// 			console.log('response detail spp', res);
	// 			var spp_detail = {
	// 				action: "singkron_spp_detail",
	// 				tahun_anggaran: _token.tahun,
	// 				api_key: config.api_key,
	// 				idSkpd: current_data.id_skpd,
	// 				id_spp: current_data.id_spp,
	// 				tipe: tipe,
	// 				sumber: 'ri',
	// 				data: res[res.jenis.toLowerCase()]
	// 			};
	// 			var data_back = {
	// 				message: {
	// 					type: "get-url",
	// 					content: {
	// 						url: config.url_server_lokal,
	// 						type: "post",
	// 						data: spp_detail,
	// 						return: true
	// 					},
	// 				}
	// 			};
	// 			chrome.runtime.sendMessage(data_back, (resp) => {
	// 				window.singkron_spp_detail = {
	// 					resolve: resolve
	// 				};
	// 				pesan_loading("Kirim data SPP detail ID="+current_data.id_spp+" tipe="+tipe);
	// 			});
	// 		},
	// 		error: function(err){
	// 			console.log('Error get detail SPP! id='+current_data.id_spp, err);
	// 			resolve();
	// 		}
	//   	});
  // 	})
  // 	.then(function () {
	//   	callback();
	// });

}

function singkron_spp_cetak_ke_lokal_skpd(current_data, tipe, status, callback) {
	console.log('ini singkron cetak');
	console.log(current_data);
	new Promise(function (resolve, reject) {
		jQuery.ajax({
			url: config.service_url + "pengeluaran/strict/spp/pembuatan/cetak/" + current_data.id_spp,
			type: 'get',
			dataType: "JSON",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
			},
			success: function (res) {
				console.log('response detail spp', res);
				var spp_detail = {
					action: "singkron_spp_detail",
					tahun_anggaran: _token.tahun,
					api_key: config.api_key,
					idSkpd: current_data.id_skpd,
					id_spp: current_data.id_spp,
					tipe: tipe,
					sumber: 'ri',
					data: res[res.jenis.toLowerCase()]
				};
				var data_back = {
					message: {
						type: "get-url",
						content: {
							url: config.url_server_lokal+'/spp_cetak',
							type: "post",
							data: spp_detail,
							return: true
						},
					}
				};
				chrome.runtime.sendMessage(data_back, (resp) => {
					window.singkron_spp_detail = {
						resolve: resolve
					};
					pesan_loading("Kirim data SPP detail ID="+current_data.id_spp+" tipe="+tipe);
				});
			},
			error: function(err){
				console.log('Error get detail SPP! id='+current_data.id_spp, err);
				resolve();
			}
	  	});
  	})
  	.then(function () {
	  	callback();
	});

}
