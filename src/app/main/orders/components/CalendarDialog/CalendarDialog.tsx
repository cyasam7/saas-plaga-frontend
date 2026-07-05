import { Dialog, DialogContent, Grid, Stack, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventClickArg } from '@fullcalendar/core';

interface ICalendarDialogProps {
	open: boolean;
	onChangeDate: (value: Date) => void;
}

function CalendarDialog(props: ICalendarDialogProps) {
	const { open, onChangeDate } = props;

	const events = [{ title: 'Meeting', start: new Date() }];
	function renderEventContent(eventInfo: EventClickArg): ReactElement {
		return (
			<>
				<b>{eventInfo.el.style}</b>
				<i>{eventInfo.event.title}</i>
			</>
		);
	}

	return (
		<Dialog
			open={open}
			maxWidth="lg"
			fullWidth
		>
			<DialogContent>
				<Grid container>
					<Grid
						item
						xs={3}
					>
						<Stack>
							<Typography>1</Typography>
							<Typography>2</Typography>
							<Typography>3</Typography>
						</Stack>
					</Grid>
					<Grid
						item
						xs={9}
					>
						<FullCalendar
							plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
							initialView="dayGridMonth"
							weekends={false}
							events={events}
							headerToolbar={false}
							eventContent={renderEventContent}
							eventClick={renderEventContent}
						/>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default CalendarDialog;
