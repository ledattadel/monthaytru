const validateEmail = (email) => {
	return String(email)
			.toLowerCase()
			.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
};

const validatePhoneNumber = (phoneNumber) => {
	return String(phoneNumber).match(/^[0]{1}\d{9}$/);
};

const validateIdCardNumber = (idCardNumber) => {
	return String(idCardNumber).match(/^\d{9}$/);
};

export { validateEmail, validatePhoneNumber, validateIdCardNumber };
