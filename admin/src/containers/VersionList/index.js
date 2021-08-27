import React, { memo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Table } from '@buffetjs/core';
import { Col, Row } from 'reactstrap';
import { request } from 'strapi-helper-plugin';
import useSWR from 'swr';

import { sanitizeVersionList } from './helper';
import pluginId from '../../pluginId';

function useVersionList(collectionId, entryId) {
  const fetcher = async () =>
    request(`/${pluginId}/${collectionId}/${entryId || '1'}`, { method: 'GET' });

  const { data, error } = useSWR([collectionId, entryId], fetcher);

  return {
    data,
    error,
    isLoading: !error && !data,
    isError: !!error,
  };
};

const versionTableHeaders = [
  {
    name: 'Date',
    value: 'createdAt',
    isSortEnabled: true
  },
  {
    name: 'Updated By',
    value: 'updatedBy',
    isSortEnabled: false
  }
];

const VersionList = ({
  setLoading,
  collectionId,
  entryId,
}) => {
  const history = useHistory();

  const { data: versionList, isLoading, error } = useVersionList(collectionId, entryId);

  useEffect(() => {
    setLoading(isLoading);
  }, [versionList, isLoading]);

  const onVersionSelected = async (e, data) => {
    history.push(`/plugins/${pluginId}/${collectionId}/${entryId}/${data.id}`);
  };

  if (isLoading) return null;
  if (error) return (
    <div style={{ color: 'red' }}>
      <h3>Error</h3>
      <pre>{error.message}</pre>
    </div>
  );

  return (
    <>
      {versionList.length > 0 && (
        <Row style={{ paddingTop: '10px' }}>
          <Col>
            <Table
              rows={sanitizeVersionList(versionList)}
              headers={versionTableHeaders}
              onClickRow={onVersionSelected}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default memo(VersionList);
