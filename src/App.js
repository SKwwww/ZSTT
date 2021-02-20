import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { edit, openEditModal, closeEditModal, delete_item, openAddModal, closeAddModal, add_data, choose_search_item, init_search } from './reducer.js';
import { sendnrecieveData } from './reducer.js';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';

const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

const UserInterface = () => (
  <div>
    <SearchBlock />
    <Table />
  </div>
)

const SearchBlock = () => {
  const dispatch = useDispatch();
  var search_by = useSelector((state)=>(state.search_by));
  var search_list = ['name','email','website','company'];
  const clickToChooseItem = (item) => {
    dispatch(choose_search_item(item));
  }
  var search;
  var inputOnchange = (e) => {
    search = e.target.value;
  }
  const searchButtonClick = () => {
    dispatch(init_search(search));
  }
  const renderSearchItems = (search_item,class_for_search) => {
    return (
      <li onClick={()=>{clickToChooseItem(search_item)}} className={class_for_search} key={i}>{search_item}</li>
    );
  }
  var list = [];
  for (var i=0;i<=search_list.length-1;i++) {
    var search_item = search_list[i];
    if (search_item == search_by) {
      var class_for_search = 'chosen-search-item';
    } else {
      var class_for_search = '';
    }
    list = list.concat(renderSearchItems(search_item,class_for_search));
  }
  return (
    <div className="search-block">
      <h2>
       Search by:
      </h2>
      <ul className="search-list">
        {list}
      </ul>
      <div>
        <input onChange={inputOnchange} className="search-input" type="text" name="search-input" />
      </div>
      <button onClick={searchButtonClick} className="search-buuton">
        <span>Search</span>
      </button>
    </div>
  );
}

const Table = () => {
  const dispatch = useDispatch();
  var searched_data = useSelector((state)=>(state.searched_data));
  var search_by = useSelector((state)=>(state.search_by));
  if (searched_data && searched_data.length>0) {
    var data = useSelector((state)=>(state.searched_data));
  } else {
    var data = useSelector((state)=>(state.data));
  }
  var isChangedData = useSelector((state)=>(state.isChangedData.id));
  var data_table = [];
  for (var i=0;i<=data.length-1;i++) {
    if (isChangedData.length>0) {
      for (var ii=0;ii<=isChangedData.length-1;ii++) {
        if (isChangedData[ii] == data[i].id) {
          var classForD = 'changed'
        } else {
          var classForD = '';
        }
      }
    }
    var id = data[i].id;
    var name = data[i].name;
    var email = data[i].email;
    var website = data[i].website;
    var company = data[i].company.name;
    data_table = data_table.concat(<tr className={classForD} key={i}><td>{name}</td><td>{email}</td><td>{website}</td><td>{company}</td><td><Edit id={id} /></td><td><Delete id={id} /></td></tr>);
  }
  return (
    <div className="table">
      <table border="1">
        <thead>
          <tr><td>name</td><td>e-mail</td><td>web-site</td><td>company(name)</td><td>edit</td><td>delete</td></tr>
        </thead>
        <tbody>
          {data_table}
        </tbody>
      </table>
      <EditModal />
      <AddModal />
      <br />
      <Add />
    </div>
  );
}

const Edit = (props) => {
  const dispatch = useDispatch();
  const EditClick = () => {
    dispatch(openEditModal(props.id));
  }
  return (
    <div className="icon">
      <img onClick={EditClick} src="../../tt/icons/edit_icon.png" />
    </div>
  );
}

const EditModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state)=>(state.editModalIsOpen.isOpen));
  const id = useSelector((state)=>(state.editModalIsOpen.id));
  const data = useSelector((state)=>(state.data));
  for (var i=0;i<=data.length-1;i++) {
    if (data[i].id == id) {
      var name = data[i].name;
      var email = data[i].email;
      var website = data[i].website;
      var company = data[i].company.name;
    }
  }
  const name_onChange = (e) => {
    name = e.target.value;
  }
  const email_onChange = (e) => {
    email = e.target.value;
  }
  const website_onChange = (e) => {
    website = e.target.value;
  }
  const company_onChange = (e) => {
    company = e.target.value;
  }
  
  const sendData = () => {
    if (name!='' && email!='' && website!='' && company!='') {
      var data_to_edit = {id: id,name: name,email: email,website: website,company: company};
      dispatch(edit(data_to_edit));
      dispatch(closeEditModal());
    } else {
      alert('Add data');
    }
  }
  
  var subtitle;
  
    return (
      <div>
        <Modal
          isOpen={isOpen}
          style={customStyles}
        >

          <h2 ref={_subtitle => (subtitle = _subtitle)}>Edit</h2>
          <button onClick={()=>{dispatch(closeEditModal())}}>close</button>
          <form>
            <div>
              name: <br />
              <input onChange={name_onChange} defaultValue={name} type="text" name="input-for-name" />
            </div>
            <div>
              e-mail: <br />
              <input onChange={email_onChange} defaultValue={email} type="text" name="input-for-email" />
            </div>
            <div>
              web-site: <br />
              <input onChange={website_onChange} defaultValue={website} type="text" name="input-for-website" />
            </div>
            <div>
              company(name): <br />
              <input onChange={company_onChange} defaultValue={company} type="text" name="input-for-company" />
            </div>
          </form>
          <button onClick={sendData} >Ok</button>
        </Modal>
      </div>
    );
}

const Delete = (props) => {
  const dispatch = useDispatch();
  const DeleteClick = (id) => {
    if (window.confirm('Delete?')) {
      dispatch(delete_item(id));
    }
  }
  return (
    <div className="icon">
      <img onClick={()=>DeleteClick(props.id)} src="../../tt/icons/del_icon.png" />
    </div>
  );
}

const Add = () => {
  const dispatch = useDispatch();
  const AddClick = () => {
    dispatch(openAddModal());
  }
  return (
    <div>
      <span className="icon" onClick={AddClick}>+ Add</span>
    </div>
  );
}

const AddModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state)=>(state.addModalIsOpen));
  const data = useSelector((state)=>(state.data));
  var name, email, website, company;
  const name_onChange = (e) => {
    name = e.target.value;
  }
  const email_onChange = (e) => {
    email = e.target.value;
  }
  const website_onChange = (e) => {
    website = e.target.value;
  }
  const company_onChange = (e) => {
    company = e.target.value;
  }
  
  const sendData = () => {
    if (name!=null && email!=null && website!=null && company!=null) {
      var data_to_add = {name: name,email: email,website: website,company: company};
      dispatch(add_data(data_to_add));
      dispatch(closeAddModal());
    } else {
      alert('Add data');
    }
  }
  
  var subtitle;
  
    return (
      <div>
        <Modal
          isOpen={isOpen}
          style={customStyles}
        >

          <h2 ref={_subtitle => (subtitle = _subtitle)}>Add</h2>
          <button onClick={()=>{dispatch(closeAddModal())}}>close</button>
          <form>
            <div>
              name: <br />
              <input onChange={name_onChange} type="text" name="input-for-name" />
            </div>
            <div>
              e-mail: <br />
              <input onChange={email_onChange} type="text" name="input-for-email" />
            </div>
            <div>
              web-site: <br />
              <input onChange={website_onChange} type="text" name="input-for-website" />
            </div>
            <div>
              company(name): <br />
              <input onChange={company_onChange} type="text" name="input-for-company" />
            </div>
          </form>
          <button onClick={sendData} >Ok</button>
        </Modal>
      </div>
    );
}

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};






export default UserInterface;
