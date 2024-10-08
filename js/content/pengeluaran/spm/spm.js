function singkron_spm_lokal(val, data) {
	jQuery('#wrap-loading').show();
    var status = val;
    var type_data = data.shift();
    new Promise(function(resolve, reject){
        if(typeof type_data == 'undefined'){
            return resolve();
        }
        singkron_spm_lokal_per_jenis(type_data, status, 1, [], function(response){
    		var page_skpd = {};
            var last = response.length-1;
            response.reduce(function (sequence, nextData) {
                return sequence.then(function (current_data) {
                    return new Promise(function (resolve_reduce, reject_reduce) {
                        pesan_loading('Get SPM '+type_data+' dari ID SKPD "'+current_data.id_skpd+'"');
                        if(!page_skpd[current_data.id_skpd]){
                            page_skpd[current_data.id_skpd] = [];
                        }
                        page_skpd[current_data.id_skpd].push(current_data);

                        // melakukan reset page sesuai data per skpd
                        current_data.page = page_skpd[current_data.id_skpd].length;

    					singkron_spm_ke_lokal_skpd(current_data, type_data, status, ()=>{
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
    		}, Promise.resolve(response[last]))
    		.then(function (data_last) {
    		    return singkron_spm_lokal(val, data);
    		});
        });
    })
    .then(function () {
        jQuery("#wrap-loading").hide();
        alert("Berhasil singkron SPM");
    });
}

function singkron_spm_lokal_per_jenis(type_data, status, page=1, response_all=[], cb){
    pesan_loading('Get data SPM jenis='+type_data+' , status='+status+', halaman='+page);
    relayAjaxApiKey({
				// url: config.service_url+'pengeluaran/strict/spm/index?jenis='+type_data+'&status='+status+'&page='+page,
        url: config.service_url+'pengeluaran/strict/spm/index?status='+status+'&page='+page,
        type: 'get',
        success: function (response) {
            console.log('SPM', response);
            if(response!=null && response.length >= 1){
                response.map(function(b, i){
                    response_all.push(b);
                })

								if(page <= 20){
										setTimeout(() => {
												console.log('ini post_spm_localdb : '+page);
				                singkron_spm_lokal_per_jenis(type_data, status, page+1, response_all, cb);
										}, 2000)
								}else{
										post_spm_localdb(response_all);
										let respx = []
										// singkron_spp_lokal(val, type_data, 1, respx);
										// return resolve();
								}

            }else{
                cb(response_all);
            }
        },
    });
}



async function post_spm_localdb(response){
		response.map(function(b, i){
				// baru yasmin caca
				setTimeout(() => {
							singkron_spm_ke_lokal_skpd(b, 'type_data', 'status', ()=>{
								resolve_reduce(nextData);
							});

							// singkron_spm_cetak_ke_lokal_skpd(b, 'type_data', 'status', ()=>{
							// 	resolve_reduce(nextData);
							// });

							console.log('ini post_spm_localdb : '+i, b);
				}, 2500 * i)
		})

}

function singkron_spm_ke_lokal_skpd(current_data, tipe, status, callback) {
    var spm = {
        action: "singkron_spm",
        tahun_anggaran: _token.tahun,
        api_key: config.api_key,
        idSkpd: current_data.id_skpd,
        tipe: tipe,
        sumber: 'ri',
        page: current_data.page,
        data: {}
    };

    spm.data[0] = {}
    spm.data[0].id_spm = current_data.id_spm;
    spm.data[0].id_spp = current_data.id_spp;
    spm.data[0].created_at = current_data.created_at;
    spm.data[0].updated_at = current_data.updated_at;
    spm.data[0].id_skpd = current_data.id_skpd;
    spm.data[0].tahun_anggaran = current_data.tahun;
    spm.data[0].id_jadwal = current_data.id_jadwal;
    spm.data[0].id_tahap = current_data.id_tahap;
    spm.data[0].status_tahap = current_data.status_tahap;
    spm.data[0].nomor_spp = current_data.nomor_spp;
    spm.data[0].keterangan_spm = current_data.keterangan_spm;
    spm.data[0].id_sub_skpd = current_data.id_sub_skpd;
    spm.data[0].jenis_spm = current_data.jenis_spm;
    spm.data[0].is_kunci_rekening_spm = current_data.is_kunci_rekening_spm;
    spm.data[0].jenis_ls_spm = current_data.jenis_ls_spm;
    spm.data[0].tahun = current_data.tahun;
    spm.data[0].status_perubahan_by = current_data.status_perubahan_by;
    spm.data[0].is_sptjm_spm = current_data.is_sptjm_spm;
    spm.data[0].bulan_gaji = current_data.bulan_gaji;
    spm.data[0].kode_tahap = current_data.kode_tahap;
    spm.data[0].id_pengajuan_tu = current_data.is_tpp;
    spm.data[0].nomor_pengajuan_tu = current_data.bulan_tpp;
    spm.data[0].nomor_spm = current_data.nomor_spm;
    spm.data[0].tanggal_spm = current_data.tanggal_spm;
    spm.data[0].is_verifikasi_spm = current_data.is_verifikasi_spm;
    spm.data[0].verifikasi_spm_at = current_data.verifikasi_spm_at;
    spm.data[0].jenis_spm = current_data.jenis_spm;
    spm.data[0].keterangan_verifikasi_spm = current_data.keterangan_verifikasi_spm;


		spm.data[0].id_daerah = current_data.id_daerah;
		spm.data[0].id_unit = current_data.id_unit;
		spm.data[0].kode_sub_skpd = current_data.kode_sub_skpd;
		spm.data[0].nama_sub_skpd = current_data.nama_sub_skpd;
		spm.data[0].verifikasi_spm_by = current_data.verifikasi_spm_by;
		spm.data[0].is_status_perubahan = current_data.is_status_perubahan;
		spm.data[0].status_perubahan_at = current_data.status_perubahan_at;
		spm.data[0].created_by = current_data.created_by;
		spm.data[0].updated_by = current_data.updated_by;
		spm.data[0].deleted_at = current_data.deleted_at;
		spm.data[0].deleted_by = current_data.deleted_by;
		spm.data[0].nilai_spm = current_data.nilai_spm;

    var data_back = {
        message: {
            type: "get-url",
            content: {
                url: config.url_server_lokal+'/spm',
                type: "post",
                data: spm,
                return: false
            },
        },
    };
    chrome.runtime.sendMessage(data_back, (resp) => {
        pesan_loading("Kirim data SPM ID SKPD="+current_data.id_skpd+" tipe="+tipe+" status="+status+" keterangan = "+current_data.keterangan_spm);
    });
    if(tipe == 'UP'){
        return callback();
    }

    // new Promise(function (resolve, reject) {
    //     jQuery.ajax({
    //         url: config.service_url + "pengeluaran/strict/spm/cetak/" + current_data.id_spm,
    //         type: 'get',
    //         dataType: "JSON",
    //         beforeSend: function (xhr) {
    //             xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
    //         },
    //         success: function (res) {
    //             console.log('response detail spm', res);
    //             var spm_detail = {
    //                 action: "singkron_spm_detail",
    //                 tahun_anggaran: _token.tahun,
    //                 api_key: config.api_key,
    //                 idSkpd: current_data.id_skpd,
    //                 id_spm: current_data.id_spm,
    //                 tipe: tipe,
    //                 sumber: 'ri',
    //                 data: res[res.jenis.toLowerCase()]
    //             };
    //             var data_back = {
    //                 message: {
    //                     type: "get-url",
    //                     content: {
    //                         url: config.url_server_lokal+'/spm_cetak',
    //                         type: "post",
    //                         data: spm_detail,
    //                         return: true
    //                     },
    //                 }
    //             };
    //             chrome.runtime.sendMessage(data_back, (resp) => {
    //                 window.singkron_spm_detail = {
    //                     resolve: resolve
    //                 };
    //                 pesan_loading("Kirim data SPM detail ID="+current_data.id_spm+" tipe="+tipe);
    //             });
    //         },
    //         error: function(err){
    //             console.log('Error get detail SPM! id='+current_data.id_spm, err);
    //             resolve();
    //         }
    //     });
    // })
    // .then(function () {
    //     callback();
    // });
}


function singkron_spm_cetak_ke_lokal_skpd(current_data, tipe, status, callback) {
	console.log('ini singkron cetak');
	console.log(current_data);
	new Promise(function (resolve, reject) {
			jQuery.ajax({
					url: config.service_url + "pengeluaran/strict/spm/cetak/" + current_data.id_spm,
					type: 'get',
					dataType: "JSON",
					beforeSend: function (xhr) {
							xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
					},
					success: function (res) {
							console.log('response detail spm', res);
							var spm_detail = {
									action: "singkron_spm_detail",
									tahun_anggaran: _token.tahun,
									api_key: config.api_key,
									idSkpd: current_data.id_skpd,
									id_spm: current_data.id_spm,
									tipe: tipe,
									sumber: 'ri',
									data: res[res.jenis.toLowerCase()]
							};
							var data_back = {
									message: {
											type: "get-url",
											content: {
													url: config.url_server_lokal+'/spm_cetak',
													type: "post",
													data: spm_detail,
													return: true
											},
									}
							};
							chrome.runtime.sendMessage(data_back, (resp) => {
									window.singkron_spm_detail = {
											resolve: resolve
									};
									pesan_loading("Kirim data SPM detail ID="+current_data.id_spm+" tipe="+tipe);
							});
					},
					error: function(err){
							console.log('Error get detail SPM! id='+current_data.id_spm, err);
							resolve();
					}
			});
	})
	.then(function () {
			callback();
	});

}
