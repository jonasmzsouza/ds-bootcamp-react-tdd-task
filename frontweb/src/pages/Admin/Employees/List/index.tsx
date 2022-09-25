import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { Employee } from 'types/employee';
import { SpringPage } from 'types/vendor/spring';
import { useCallback, useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';
import { hasAnyRoles } from 'util/auth';

import './styles.css';

type ControlComponentData = {
  activePage: number;
};

const List = () => {
  const [page, setPage] = useState<SpringPage<Employee>>();

  const [controlComponentData, setControlComponentData] =
    useState<ControlComponentData>({
      activePage: 0,
    });

  const handlePageChange = (pageNumber: number) => {
    setControlComponentData({
      activePage: pageNumber,
    });
  };

  const getEmployees = useCallback(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/employees',
      params: {
        page: controlComponentData.activePage,
        size: 4,
      },
      withCredentials: true,
    };

    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  }, [controlComponentData]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  return (
    <>
      {hasAnyRoles(['ROLE_ADMIN']) && (
        <Link to="/admin/employees/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>
      )}

      {page?.content.map((employee) => {
        return (
          <div className="col-sm-6 col-md-12" key={employee.id}>
            <EmployeeCard employee={employee} />
          </div>
        );
      })}

      <Pagination
        forcePage={page?.number}
        pageCount={page ? page?.totalPages : 0}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
