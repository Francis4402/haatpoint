import { useTranslation } from '@/state/languageStore';

interface FormatPriceProps {
    price: number;
    currency?: string;
}

const FormatPrice = ({ price, currency = 'BDT' }: FormatPriceProps) => {
    const { language } = useTranslation();

    const formatPrice = (amount: number) => {
        const locale = language === 'bn' ? 'bn-BD' : 'en-US';
        const isWhole = Number.isInteger(amount);
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: isWhole ? 0 : 2,
            maximumFractionDigits: isWhole ? 0 : 2
        }).format(amount);
    };

    return <span>{formatPrice(price)}</span>;
};

export default FormatPrice;
