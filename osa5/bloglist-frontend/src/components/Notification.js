const notificationStyle = {
    background: 'silver',
    fontSize: '30px',
    marginBottom: '10px',
    padding: '5px',
    border: 'solid 2px'
}

const Success = ({ text }) => {
    const success = {
        color: 'green',
        border: 'green'
    }

    return (
        <div style={{ ...success, ...notificationStyle }}>
            {text}
        </div>
    )
}

const Fail = ({ text }) => {
    const fail = {
        color: 'red',
        border: 'red'
    }

    return (
        <div style={{ ...fail, ...notificationStyle }}>
            {text}
        </div>
    )
}

const Notification = ({ messageStatus, text }) => {
    if (text === null) {
        return null
    }

    if (messageStatus === 'success') {
        return (
                <Success text={text} />
        )
    }

    if (messageStatus === 'fail') {
        return (
                <Fail text={text} />
        )
    }
}

export default Notification