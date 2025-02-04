package com.wintus.wbm.dao;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Repository;

@Repository("computeDAO")
public class ComputeDAOImpl implements ComputeDAO { 
	@Autowired
	private SqlSession sqlSession;	
	private static final Logger logger = LoggerFactory.getLogger(ComputeDAOImpl.class);
	@Override
	public List<Map<String, Object>> selectComputeInfo(Map<String, Object> paramData) throws DataAccessException {
		return sqlSession.selectList("mapper.compute.select_compute_data", paramData); 
	}
	@Override
	public Map<String, Object> selectDetailComputeInfo(int paramData) throws DataAccessException {
		return sqlSession.selectOne("mapper.compute.select_detail_computeinfo", paramData);  
	}
	@Override
	public int saveComputeInfo(Map<String, Object> paramData) throws DataAccessException {
		Integer computeCode = Integer.parseInt(paramData.get("computeCode").toString());
		int resultData = 0;
		if(computeCode == null || computeCode <= 0) {
			resultData = sqlSession.insert("mapper.compute.insert_compute_info", paramData);
		} else {
			resultData = sqlSession.update("mapper.compute.update_compute_info", paramData); 
		}
		return resultData;
	}
	@Override
	public int deleteComputeInfo(int paramData) throws DataAccessException {
		return sqlSession.delete("mapper.compute.delete_compute_info", paramData);
	}
}
