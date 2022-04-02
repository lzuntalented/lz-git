import { Select, SelectProps } from 'antd';
import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectOption } from '../../common/type';
import { seachRepo } from '../../services/repo';
import { debounce } from '../../tool';

function RepSelect(props: SelectProps) {
  const navigate = useNavigate();
  const [options, setOptions] = useState([] as SelectOption<string>[]);
  const search = (e: any) => {
    if (!e.target.value) {
      setOptions([]);
    } else {
      seachRepo(e.target.value).then((r) => {
        const list = (r || [] as string[]);
        setOptions((list).map((it) => ({
          label: it,
          value: it,
        })));
      });
    }
  };
  return (
    <Select
      showSearch
      options={options}
      onInputKeyDown={search}
      onChange={(e) => {
        navigate(`/${e}`);
      }}
      {...props}
    />
  );
}

export default RepSelect;
