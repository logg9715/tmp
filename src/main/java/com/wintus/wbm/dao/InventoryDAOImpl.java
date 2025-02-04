package com.wintus.wbm.dao;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Repository;

@Repository("inventoryDAO")
public class InventoryDAOImpl implements InventoryDAO { 
	@Autowired
	private SqlSession sqlSession;	
	private static final Logger logger = LoggerFactory.getLogger(InventoryDAOImpl.class);
	@Override
	public List<Map<String, Object>> selectInventoryInfo() throws DataAccessException {
		return sqlSession.selectList("mapper.inventory.select_inventory_data"); 
	}
	@Override
	public Map<String, Object> selectDetailInventoryInfo(int paramData) throws DataAccessException {
		return sqlSession.selectOne("mapper.inventory.select_detail_inventoryinfo", paramData);  
	}
	@Override
	public int saveInventoryInfo(Map<String, Object> paramData) throws DataAccessException {
		Integer inventoryCode = Integer.parseInt(paramData.get("inventoryCode").toString());
		int resultData = 0;
		if(inventoryCode == null || inventoryCode <= 0) {
			resultData = sqlSession.insert("mapper.inventory.insert_inventory_info", paramData);
		} else {
			resultData = sqlSession.update("mapper.inventory.update_inventory_info", paramData); 
		}
		return resultData;
	}
	@Override
	public int deleteInventoryInfo(int paramData) throws DataAccessException {
		return sqlSession.delete("mapper.inventory.delete_inventory_info", paramData);
	}	
	
	@Override
	public List<Map<String, Object>> selectInventorySubInfo(Map<String,Object> paramData) throws DataAccessException {
		return sqlSession.selectList("mapper.inventory.select_inventory_subdata", paramData); 
	}
	@Override
	public Map<String, Object> selectDetailInventorySubInfo(int paramData) throws DataAccessException {
		return sqlSession.selectOne("mapper.inventory.select_detail_inventorysubinfo", paramData);  
	}
	@Override
	public int saveInventorySubInfo(Map<String, Object> paramData) throws DataAccessException {
		logger.info("paramData=" + paramData);
		Integer inventorySubCode = Integer.parseInt(paramData.get("inventorySubCode").toString());
		int resultData = 0;
		if(inventorySubCode == null || inventorySubCode <= 0) {
			resultData = sqlSession.insert("mapper.inventory.insert_inventory_subinfo", paramData);
		} else {
			resultData = sqlSession.update("mapper.inventory.update_inventory_subinfo", paramData); 
		}
		logger.info("result=" + resultData);
		return resultData;
	}
	@Override
	public int deleteInventorySubInfo(int paramData) throws DataAccessException {
		return sqlSession.delete("mapper.inventory.delete_inventory_subinfo", paramData);
	}
	@Override
	public Map<String,Integer> selectInventoryCount(int paramData) throws DataAccessException {
		return sqlSession.selectOne("mapper.inventory.select_inventory_count", paramData);  
	}
}
