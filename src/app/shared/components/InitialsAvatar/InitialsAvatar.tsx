import { Avatar } from '@mui/material';

interface InitialsAvatarProps {
	name: string;
}

/** Small avatar with up to two initials ("Juan Pérez" → "JP"), used in grid cells. */
function InitialsAvatar({ name }: InitialsAvatarProps) {
	const initials = name
		.split(' ')
		.filter(Boolean)
		.map((word) => word[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();

	return <Avatar sx={{ width: 28, height: 28, fontSize: 11, fontWeight: 600 }}>{initials}</Avatar>;
}

export default InitialsAvatar;
