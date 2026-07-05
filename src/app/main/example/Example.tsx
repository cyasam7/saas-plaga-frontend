import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useWebSocket } from 'src/app/shared-hooks/useWebSocket';
import { Button } from '@mui/material';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function Example() {
	const { t } = useTranslation('examplePage');

	const [qr, setQr] = useState<string>('');
	const [Loading, setLoading] = useState(true);
	const socket = useWebSocket();

	useEffect(() => {
		if (!socket) return;
		socket.emit('qr-whats-app');

		socket.on('qr-response-base64', (user) => {
			setLoading(false);
		});
		socket.on('qr-response-user-info', (base64: string) => {
			setQr(base64);
			setLoading(false);
		});
	}, [socket]);

	function getQR(): void {
		if (!socket) return;

		socket.emit('get-qr-wp', (data: string) => {
			setQr(data);
		});
	}
	return (
		<Root
			header={
				<div className="p-24">
					<h4>{t('TITLE')}</h4>
				</div>
			}
			content={
				<div className="p-24">
					<h4>Content</h4>
					<br />
					<p>hla</p>
					<Button onClick={getQR}>Get Base</Button>
					<img
						src={qr}
						alt=""
						width={400}
						height={400}
					/>
				</div>
			}
		/>
	);
}

export default Example;
