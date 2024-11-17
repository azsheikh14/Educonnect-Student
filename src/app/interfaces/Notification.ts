interface Notification {
    _id: string;
    sender: string;
    message: string;
    redirect: string;
    notificationType: string;
}

export default Notification;