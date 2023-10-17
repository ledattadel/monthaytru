import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AppToast from '../myTool/AppToast';

import {
  sendEmailAPI,
	patchUpdateCartAPI
} from '../components/services/index';

export default function DatePickerDialog({
	open,
	setOpen,
	email,
	cartId,
}) {
	const [value, setValue] = React.useState(new Date());
	const [isError, setIsError] = React.useState(false);
	const [openToast, setOpenToast] = React.useState(false);
	const [contentToast, setContentToast] = React.useState('');
	const [severity, setSeverity] = React.useState('');

	const getDateTime = (string) => {
		const date = `${string.getDate()}/${string.getMonth()}/${string.getFullYear()}`;
		return date;
	};

	const sendEmail = async (body, dateReturn) => {
		const response = await sendEmailAPI(body);
		if (response.status === 200) {
			setContentToast('Hệ thống đã gởi email xác nhận đặt lịch');
			setSeverity('success');
			setOpenToast(true);
			setOpen(false);
			const responseData = await patchUpdateCartAPI({
				idCart: cartId,
				formData: {
					returnDate: dateReturn,
				},
			})
			if (responseData.status === 200) {
				setContentToast('Hệ thống đã cập nhật đơn hàng');
				setSeverity('success');
				setOpenToast(true);
			} else {
				setContentToast('Lỗi khi cập nhật đơn hàng');
				setSeverity('error');
				setOpenToast(true);
			}
		} else {
			setOpenToast(true);
			setContentToast('Gửi email thất bại');
			setSeverity('error');
			console.log(response);
		}
	};

	const handleClose = () => {
		setOpen(false);
		setValue(new Date());
		setIsError(false);
	};

	const handleOK = async () => {
		if (!value) {
			setIsError(true);
		} else {
			setIsError(false);
			let d = new Date(value);
			const body = {
				email: email,
				dateTime: getDateTime(d),
			};

			await sendEmail(body, d)
		}
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Chọn thời gian</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Hãy nhập thời gian hẹn khách hàng có thể quay lại
					</DialogContentText>
					<Box
						noValidate
						component="form"
						sx={{
							display: 'flex',
							flexDirection: 'column',
							m: '40px 20px',
						}}
					>
						<DatePicker
							label="Select day"
							inputFormat="DD/MM/YYYY"
							value={value}
							minDate={new Date()}
							onChange={(newValue) => {
								setValue(newValue);
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
					</Box>
				</DialogContent>
				<p
					style={{
						margin: '10px',
						color: 'red',
						fontWeight: 'Bold',
						justifyContent: 'flex-end',
						display: isError ? 'flex' : 'none',
					}}
				>
					Vui lòng nhập đầy đủ thông tin
				</p>
				<DialogActions>
					<Button onClick={handleClose}>Close</Button>
					<Button onClick={handleOK}>Accept</Button>
				</DialogActions>
			</Dialog>
			<AppToast
				content={contentToast}
				type={0}
				isOpen={openToast}
				severity={severity}
				callback={() => {
					setOpenToast(false);
				}}
			/>
		</LocalizationProvider>
	);
}
