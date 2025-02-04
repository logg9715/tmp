package com.wintus.wbm.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Repository;

@Repository("loginDAO")
public class LoginDAOImpl implements LoginDAO {
	@Autowired
	private SqlSession sqlSession;	
	private static final Logger logger = LoggerFactory.getLogger(LoginDAOImpl.class); 
	@Override
	public Map<String, Object> selectLoginCheck(Map<String, Object> paramData) throws DataAccessException {
		return sqlSession.selectOne("mapper.member.select_login_check", paramData);
	}
	@Override
	public List<Map<String, Object>> selectGroupInfo() throws DataAccessException {
		return sqlSession.selectList("mapper.member.select_group_info");
	}
	 
	@Override
	public int saveJoinInfo(Map<String, Object> paramData) throws DataAccessException {
		int userCode = sqlSession.selectOne("mapper.member.select_overlapcheck_id", paramData.get("user_id"));
		if(userCode <= 0) return sqlSession.insert("mapper.member.insert_member_info", paramData);			
		else return -2;
	}
	
	@Override
	public int selectIdOverlapCheck(String paramData) throws DataAccessException {
		return sqlSession.selectOne("mapper.member.select_overlapcheck_id", paramData);
	}
	@Override
	public String selectFindPassword(Map<String, String> paramData) throws DataAccessException {
		return sqlSession.selectOne("mapper.member.select_find_password", paramData);
	}
}
