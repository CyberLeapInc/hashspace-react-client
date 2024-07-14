import dynamic from 'next/dynamic';
import animationData from '../../public/PRoLakWHmq.json';

const Lottie = dynamic(() => import('react-lottie').then((b) => b), {
    ssr: false
})

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const LoadingComponent = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.0)',
            zIndex: 1000,
            borderRadius: '12px',
            overflow: "hidden"
        }}>
            <Lottie options={defaultOptions}
                    height={250}
                    width={250}
            />
        </div>
    )
}