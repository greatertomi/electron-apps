import React, {useState} from 'react';

const AddLogItem = ({addItem}) => {
  const [text, setText] = useState('')
  const [user, setUser] = useState('')
  const [priority, setPriority] = useState('')

  const onSubmit = e => {
    e.preventDefault()
    addItem({text, user, priority})
  }

  return (
    <div className='card mt-5 mb-3'>
      <div className='card-body'>
        <form onSubmit={onSubmit}>
          <div className='row my-3'>
            <div className='col'>
              <input type='text' placeholder='log' value={text}
                     onChange={(e) => setText(e.target.value)}/>
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              <input type='text' placeholder='User' value={user}
                     onChange={(e) => setUser(e.target.value)}/>
            </div>
            <div className='col'>
              <select placeholder='Priority' value={priority}
                      onChange={(e) => setPriority(e.target.value)}>
                <option value='0'>Select Priority</option>
                <option value='low'>Low</option>
                <option value='moderate'>Moderate</option>
                <option value='high'>High</option>
              </select>
            </div>
          </div>
          <div className='row my-3'>
            <div className='col'>
              <button className='btn btn-secondary btn-block'>Add Log</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLogItem;