package com.wintus.wbm.dao;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Repository;

@Repository("settingDAO")
public class SettingDAOImpl implements SettingDAO { 
	@Autowired
	private SqlSession sqlSession;	
	private static final Logger logger = LoggerFactory.getLogger(SettingDAOImpl.class);

	@Override
	public List<Map<String, Object>> selectManagerInfo(Map<String, Object> paramData) throws DataAccessException {
		return sqlSession.selectList("mapper.setting.select_manager_data", paramData); 
	}

	@Override
	public Map<String, Object> selectDetailUserInfo(int paramData) throws DataAccessException {
		return sqlSession.selectOne("mapper.setting.select_detail_userinfo", paramData);  
	}

	@Override
	public int saveUserInfo(Map<String, Object> paramData) throws DataAccessException {
		Integer userCode = Integer.parseInt(paramData.get("userCode").toString());
		int resultData = 0;
		if(userCode == null || userCode <= 0) {
			int checkUserCode = sqlSession.selectOne("mapper.member.select_overlapcheck_id", paramData.get("user_id"));
			if(checkUserCode <= 0) resultData = sqlSession.insert("mapper.setting.insert_user_info", paramData);
			else resultData = -2;
		} else {
			int checkUserCode = sqlSession.selectOne("mapper.setting.select_update_overlapcheck", paramData);
			if(checkUserCode <= 0) resultData = sqlSession.update("mapper.setting.update_user_info", paramData);
			else resultData = -2;
		}
		return resultData;
	}

	@Override
	public int deleteUserInfo(int paramData) throws DataAccessException {
		return sqlSession.delete("mapper.setting.delete_user_info", paramData);
	}
	
	@Override
	public List<Map<String, Object>> selectSalesTypeData() throws DataAccessException {
		return sqlSession.selectList("mapper.setting.select_salestype_data"); 
	}
	
	@Override
	public Map<String, Object> selectDetailSalesTypeInfo(int paramData) throws DataAccessException {
		return sqlSession.selectOne("mapper.setting.select_detail_salestypeinfo", paramData);  
	}

	@Override
	public int saveSalesTypeInfo(Map<String, Object> paramData) throws DataAccessException {
		Integer typeCode = Integer.parseInt(paramData.get("typeCode").toString());
		int resultData = 0;
		if(typeCode == null || typeCode <= 0) {
			int checkTypeName = sqlSession.selectOne("mapper.setting.select_overlapcheck_typename", paramData.get("typeName"));
			if(checkTypeName <= 0) resultData = sqlSession.insert("mapper.setting.insert_sales_type", paramData);
			else resultData = -2;
		} else {
			int checkUserCode = sqlSession.selectOne("mapper.setting.select_update_overlaptypecheck", paramData);
			if(checkUserCode <= 0) resultData = sqlSession.update("mapper.setting.update_sales_type", paramData);
			else resultData = -2;
		}
		return resultData;
	}
	
	@Override
	public int deleteSalesTypeInfo(int paramData) throws DataAccessException {
		return sqlSession.delete("mapper.setting.delete_salestype_info", paramData);
	}

	@Override
	public int saveContractCompanyInfo(Map<String, Object> paramData) throws DataAccessException {
		Integer companyCode = Integer.parseInt(paramData.get("companyCode").toString());
		int resultData = 0;
		if(companyCode == null || companyCode <= 0) {
			int checkCompanyName = sqlSession.selectOne("mapper.setting.select_overlapcheck_company", paramData.get("typeName"));
			if(checkCompanyName <= 0) resultData = sqlSession.insert("mapper.setting.insert_contract_company", paramData);
			else resultData = -2;
		} else {
			int checkCompanyCode = sqlSession.selectOne("mapper.setting.select_update_overlapcompanycheck", paramData);
			if(checkCompanyCode <= 0) resultData = sqlSession.update("mapper.setting.update_contract_company", paramData);
			else resultData = -2;
		}
		return resultData;
	}

	@Override
	public List<Map<String, Object>> selectContractCompanyInfo() throws DataAccessException {
		return sqlSession.selectList("mapper.setting.select_contractcompany_data"); 
	}

	@Override
	public Map<String, Object> selectDetailContractCompanyInfo(int paramData) throws DataAccessException {
		return sqlSession.selectOne("mapper.setting.select_detail_contractcompanyinfo", paramData);  
	}

	@Override
	public int deleteContractCompanyInfo(int paramData) throws DataAccessException {
		return sqlSession.delete("mapper.setting.delete_contractcompany_info", paramData);
	}	

}
