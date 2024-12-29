import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import Select from 'react-select';
import './location.css';
import { updateProvince, updateCity, updateWard } from "../../store/checkoutSlice";
export const LocationSelector = () => {
  const [tinhList, setTinhList] = useState([]);
  const [quanList, setQuanList] = useState([]);
  const [phuongList, setPhuongList] = useState([]);
  const [selectedTinh, setSelectedTinh] = useState(null);
  const [selectedQuan, setSelectedQuan] = useState(null);
  const [selectedPhuong, setSelectedPhuong] = useState(null);
  const dispatch=useDispatch()
  
  // Fetch Tỉnh Thành data on component mount
  useEffect(() => {
    fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setTinhList(data.data);
          dispatch.updateProvince()
        }
      })
      .catch((error) => console.error('Error fetching Tỉnh Thành:', error));
  }, []);

  // Fetch Quận Huyện data when a Tỉnh Thành is selected
  useEffect(() => {
    if (selectedTinh) {
      fetch(`https://esgoo.net/api-tinhthanh/2/${selectedTinh.value}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 0) {
            setQuanList(data.data);
            setPhuongList([]); // Clear Phường Xã list
          }
        })
        .catch((error) => console.error('Error fetching Quận Huyện:', error));
    }
  }, [selectedTinh]);

  // Fetch Phường Xã data when a Quận Huyện is selected
  useEffect(() => {
    if (selectedQuan) {
      fetch(`https://esgoo.net/api-tinhthanh/3/${selectedQuan.value}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 0) {
            setPhuongList(data.data);
          }
        })
        .catch((error) => console.error('Error fetching Phường Xã:', error));
    }
  }, [selectedQuan]);

  // Convert data to format that React Select expects
  const tinhOptions = tinhList.map((tinh) => ({
    value: tinh.id,
    label: tinh.full_name,
  }));

  const quanOptions = quanList.map((quan) => ({
    value: quan.id,
    label: quan.full_name,
  }));

  const phuongOptions = phuongList.map((phuong) => ({
    value: phuong.id,
    label: phuong.full_name,
  }));
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontFamily:'Roboto'
    }),
    singleValue: (provided) => ({
      ...provided,
      fontFamily:'Roboto'
    }),
  }

  return (
    <div className="css_select_div">
      <Select
        className="css_select"
        id="tinh"
        name="tinh"
        maxMenuHeight={250} 
        styles={customStyles}
        title="Chọn Tỉnh Thành"
        options={tinhOptions}
        value={selectedTinh}
        onChange={(selectedOption)=>{setSelectedTinh(selectedOption); dispatch(updateProvince(selectedOption))}}
        placeholder="Tỉnh Thành"
        required
      />

      <Select
        className="css_select"
        id="quan"
        name="quan"
        title="Chọn Quận Huyện"
        maxMenuHeight={250} 
        styles={customStyles}
        options={quanOptions}
        value={selectedQuan}
        onChange={(selectedOption)=>{setSelectedQuan(selectedOption); dispatch(updateCity(selectedOption))}}
        placeholder="Quận Huyện"
        isDisabled={!selectedTinh}
        required
      />

      <Select
        className="css_select"
        id="phuong"
        name="phuong"
        title="Chọn Phường Xã"
        styles={customStyles}
        options={phuongOptions}
        maxMenuHeight={250} 
        value={selectedPhuong}
        onChange={(selectedOption)=>{setSelectedPhuong(selectedOption); dispatch(updateWard(selectedOption))}}
        placeholder="Phường Xã"
        isDisabled={!selectedQuan}
        required
      />
    </div>
  );
};

