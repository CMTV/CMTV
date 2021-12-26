type DateLike = Date | string;

export class UtilDate
{
    static toStrDate(date: DateLike, yearFirst = true)
    {
        if (!date) return null;
    
        if (typeof date === 'string')
        {
            let dateArr = date.trim().split('.');
            date = new Date(dateArr[0].length === 4 ? date : dateArr.reverse().join('.'));
        }

        let strDate = date.toLocaleDateString('ru-RU', {
            year:   'numeric',
            month:  '2-digit',
            day:    '2-digit'
        });

        return yearFirst ? strDate.split('.').reverse().join('.') : strDate;
    }

    static dateFrom(date: DateLike)
    {
        if (!date) return null;
        
        return new Date(date instanceof Date ? date : this.toStrDate(date));
    }

    static getDayMonth(date: DateLike)
    {
        if (!date) return null;

        return this.toStrDate(date, false).slice(0, -5);
    }

    static getFancyDate(date: DateLike)
    {
        if (!date) return null;
        
        return this.dateFrom(date).toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).replace(' г.', '');
    }

    static getYear(date: DateLike)
    {
        if (!date) return null;
        
        return +(this.toStrDate(date).split('.').shift());
    }

    static getDaysInYear(date: DateLike)
    {
        if (!date) return null;

        //let year = this.getYear(date);
        //return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;

        return 366;
    }

    static getDayInYear(date: DateLike)
    {
        if (!date) return null;

        date = this.dateFrom(date);
        return (Date.UTC(2020, date.getMonth(), date.getDate()) - Date.UTC(2020, 0, 0)) / 24 / 60 / 60 / 1000;
    }

    static getFancyTime(hours: number)
    {
        let minutes = hours * 60;

        if (Math.floor(minutes) === 0) return null;

        let timeAmplifiers = {
            'мин':  60,
            'ч':    60,
            'д':    24,
            'г':    365
        }

        let current = minutes;
        let labels = ['мин', null];

        for (let i = 1; i < Object.keys(timeAmplifiers).length; i++) // i = 1 - Skipping minutes!
        {
            let timeLabel =     Object.keys(timeAmplifiers)[i];
            let timeAmplifier = timeAmplifiers[timeLabel];

            let newCurrent = current / timeAmplifier;

            if (Math.floor(newCurrent) === 0) break;
            else
            {
                labels[1] = labels[0];
                labels[0] = timeLabel;
                current = newCurrent;
            }
        }

        let mainNum = Math.floor(current);
        let secondaryNum = Math.floor((current - mainNum) * timeAmplifiers[labels[0]]);

        if (isNaN(secondaryNum) || secondaryNum === 0)
            secondaryNum = null;

        return mainNum + ' ' + labels[0] + (secondaryNum ? ' ' + secondaryNum + ' ' + labels[1] : '');
    }

    static toHours(duration: string|number): number
    {
        duration = ''+duration;

        let arr = duration.split(':');

        if (arr.length === 1)
            return parseFloat(duration);

        return +arr[0] + (+arr[1])/60;
    }
}