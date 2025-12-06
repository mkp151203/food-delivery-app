import {
    ClipboardList, CheckCircle, ChefHat, Bike, PartyPopper, XCircle
} from 'lucide-react';
import './OrderStatus.css';

const ORDER_STAGES = [
    { key: 'placed', label: 'Order Placed', Icon: ClipboardList },
    { key: 'confirmed', label: 'Confirmed', Icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', Icon: ChefHat },
    { key: 'out-for-delivery', label: 'Out for Delivery', Icon: Bike },
    { key: 'delivered', label: 'Delivered', Icon: PartyPopper }
];

const OrderStatus = ({ status, statusHistory = [] }) => {
    const currentIndex = ORDER_STAGES.findIndex(s => s.key === status);

    if (status === 'cancelled') {
        return (
            <div className="order-status cancelled">
                <div className="status-icon">
                    <XCircle size={24} />
                </div>
                <span className="status-text">Order Cancelled</span>
            </div>
        );
    }

    return (
        <div className="order-status-tracker">
            <div className="status-progress">
                {ORDER_STAGES.map((stage, index) => {
                    const Icon = stage.Icon;
                    return (
                        <div
                            key={stage.key}
                            className={`status-step ${index <= currentIndex ? 'completed' : ''} ${index === currentIndex ? 'current' : ''}`}
                        >
                            <div className="step-icon">
                                <Icon size={22} />
                            </div>
                            <span className="step-label">{stage.label}</span>
                            {index < ORDER_STAGES.length - 1 && (
                                <div className={`step-connector ${index < currentIndex ? 'completed' : ''}`} />
                            )}
                        </div>
                    );
                })}
            </div>
            {statusHistory.length > 0 && (
                <div className="status-history">
                    <h4>Status History</h4>
                    {statusHistory.map((entry, index) => (
                        <div key={index} className="history-entry">
                            <span className="history-status">{entry.status}</span>
                            <span className="history-time">
                                {new Date(entry.timestamp).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderStatus;
