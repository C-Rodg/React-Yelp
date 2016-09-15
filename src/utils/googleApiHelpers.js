export function searchNearby(google, map, request) {
	return new Promise((resolve, reject) => {
		const service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, (results, status, pagination) => {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				let sorted = results.sort((a, b) => {
						if (a.rating > b.rating){
							return 1;
						}
						if (a.rating < b.rating) {
							return -1;
						}
						return 0;
				});
				resolve(sorted, pagination);
			} else {
				reject(results, status);
			}
		});
	});
}

export function getDetails(google, map, placeId) {
	return new Promise((resolve, reject) => {
		const service = new google.maps.places.PlacesService(map);
		const request = {
			placeId
		};

		service.getDetails(request, (place, status) => {
			if (status !== google.maps.places.PlacesServiceStatus.OK) {
				return reject(status);
			} else {
				console.log(place);
				resolve(place);
			}
		});
	})
}