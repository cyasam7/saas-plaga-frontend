import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { AppConfigService } from 'src/app/shared/services/AppConfig';
import { IFormSaveAccount } from 'src/app/shared/entities/AppConfig';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import { accountSchema, defaultValuesAccountUser, validateLogo } from './config';
import { ReportType } from './entities/ReportPreview';

export function useConfigurationReports() {
	const user = useSelector(selectUser);
	const tenantId = user.data.tenant;
	const [logoError, setLogoError] = useState<string | null>(null);
	const [reportType, setReportType] = useState<ReportType>('certificate');
	const [previewOpen, setPreviewOpen] = useState(false);

	const { data, isLoading } = useQuery({
		queryFn: () => AppConfigService.get({ tenantId }),
		queryKey: ['AccountUser', tenantId]
	});

	const formHandler = useForm<IFormSaveAccount>({
		defaultValues: defaultValuesAccountUser,
		resolver: yupResolver(accountSchema),
		mode: 'onChange'
	});

	const { logo, name, address, licenseSanitary, primaryColor, secondaryColor } = formHandler.watch();

	const imagePreview = useMemo(() => {
		if (!logo) {
			return undefined;
		}

		return URL.createObjectURL(logo);
	}, [logo]);

	useEffect(() => {
		if (!imagePreview) {
			return undefined;
		}

		return () => URL.revokeObjectURL(imagePreview);
	}, [imagePreview]);

	useEffect(() => {
		if (data) {
			formHandler.reset({
				address: data.address,
				name: data.name,
				primaryColor: data.primaryColor || '#000000',
				secondaryColor: data.secondaryColor || '#000000',
				licenseSanitary: data.licenseSanitary || ''
			});
		}

		return () => {
			formHandler.reset(defaultValuesAccountUser);
		};
	}, [JSON.stringify(data)]);

	function handleChangeImage(e: ChangeEvent<HTMLInputElement>): void {
		const { files } = e.target;

		if (files.length === 0) {
			return;
		}

		const [file] = files;
		const error = validateLogo(file);

		setLogoError(error);

		if (!error) {
			formHandler.setValue('logo', file, { shouldDirty: true });
		}

		/* Sin esto, volver a elegir el mismo archivo tras un error no dispara change. */
		e.target.value = '';
	}

	async function handleSubmit(formValue: IFormSaveAccount): Promise<void> {
		await AppConfigService.save(formValue);
		formHandler.reset(formValue);
		displayToast({
			anchorOrigin: { horizontal: 'right', vertical: 'top' },
			autoHideDuration: 1500,
			message: 'Se ha guardado correctamente',
			variant: 'success'
		});
	}

	function handleChangeReportType(_e: MouseEvent<HTMLElement>, value: ReportType | null): void {
		/* value es null cuando se pulsa el botón ya activo: mantenemos siempre uno seleccionado. */
		if (value) {
			setReportType(value);
		}
	}

	const { isSubmitting, isDirty, isValid } = formHandler.formState;
	const logoUrl = imagePreview ?? data?.logo;

	return {
		formHandler,
		isLoading,
		isSubmitting,
		isDirty,
		isValid,
		logoError,
		logoUrl,
		reportType,
		previewOpen,
		setPreviewOpen,
		handleChangeImage,
		handleChangeReportType,
		onSubmit: formHandler.handleSubmit(handleSubmit),
		previewValues: { name, address, licenseSanitary, primaryColor, secondaryColor, logoUrl }
	};
}
