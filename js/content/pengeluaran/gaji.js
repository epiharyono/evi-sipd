

function get_gaji(id_skpd,bulan_gaji){
	console.log('get gaji');
	new Promise(function (resolve, reject) {
			jQuery.ajax({
          url: config.service_url+'pengeluaran/strict/gaji-pegawai/cetak?id_skpd='+id_skpd+'&bulan='+bulan_gaji, //+'&jenis_pegawai='+jenis,
					type: 'get',
					dataType: "JSON",
					beforeSend: function (xhr) {
							xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
					},
					success: function (res) {
							console.log('response get gaji', res);
							var gaji_cetak = {
									action: "singkron_gaji_cetak",
									tahun_anggaran: _token.tahun,
									api_key: config.api_key,
                  id_skpd: id_skpd,
									bulan_gaji: bulan_gaji,
									sumber: 'ri',
									data: res,
							};
							var data_back = {
									message: {
											type: "get-url",
											content: {
													url: config.url_server_lokal+'/gaji_cetak',
													type: "post",
													data: gaji_cetak,
													return: true
											},
									}
							};
							chrome.runtime.sendMessage(data_back, (resp) => {
									pesan_loading("Kirim data Gaji detail");
							});
					},
					error: function(err){
							console.log('error get gaji');
							resolve();
					}
			});
	})

}
