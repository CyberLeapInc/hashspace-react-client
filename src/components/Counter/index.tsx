import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import css from "@/components/BuyProduct/index.module.css";

export const Counter: React.FC<{
    timeLeft: number;
    onCountFinish: () => void;
}> = ({ timeLeft, onCountFinish }) => {
    const [time, setTime] = useState(timeLeft);
    const [timeStr, setTimeStr] = useState('')

    const secondsToMMSS =(seconds: number) => {
        let duration = moment.duration(seconds, 'seconds');
        let hours = duration.hours();
        let minutes = duration.minutes();
        let secs = duration.seconds();
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        if (time <= 0) {
            onCountFinish();
            return;
        }

        const intervalId = setInterval(() => {
            const timeLeft = time - 1
            setTime(timeLeft);
            setTimeStr(secondsToMMSS(timeLeft))
        }, 1000);

        // Cleanup the interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [time, timeStr, onCountFinish]);

    return (
        <div className={css.counter}>
            {time > 0 ? (
                <span>剩余有效时间 {timeStr} </span>
            ) : (
                <span>已超时</span>
            )}
        </div>
    );
};