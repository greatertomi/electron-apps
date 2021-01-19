import React from 'react';
import Badge from 'react-bootstrap/Badge'
import Moment from 'react-moment'

const LogItem = ({log, deleteItem}) => {
  const setVariant = (priority) => {
    if (priority === 'high') {
      return 'danger'
    } else if (priority === 'moderate') {
      return 'warning'
    } else {
      return 'success'
    }
  }
  return (
    <tr>
      <td>
        <Badge variant={setVariant(log.priority)} className='p-2'>
          {log.priority.charAt(0).toUpperCase() + log.priority.slice(1)}
        </Badge>
      </td>
      <td>{log.text}</td>
      <td>{log.user}</td>
      <td>
        <Moment format='MMMM Do YYYY, h:mm:ss a'>{new Date(log.created)}</Moment>
      </td>
      <td>
        <button className='btn btn-danger btn-sm' onClick={deleteItem}>x</button>
      </td>
    </tr>
  );
};

export default LogItem;