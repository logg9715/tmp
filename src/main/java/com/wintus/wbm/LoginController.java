package com.wintus.wbm;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.wintus.wbm.common.AES256;
import com.wintus.wbm.common.common;
import com.wintus.wbm.dao.LoginDAO;

import net.sf.json.JSONObject;

/**
 * Handles requests for the application home page.
 */
@Controller("loginController")
@EnableAspectJAutoProxy
public class LoginController { 
	@Autowired
	private LoginDAO loginDAO;
	
	private int sessionTmiCode;
	
	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	// 관제센터 현황 정보 처음 페이지 로딩 시 처리
	@RequestMapping(value= "login" ,method={RequestMethod.POST,RequestMethod.GET})
	public ModelAndView login(HttpServletRequest request, HttpServletResponse response) throws Exception{
		ModelAndView mav = new ModelAndView();
		String viewName=(String)request.getAttribute("viewName");
		mav.setViewName(viewName);	    
		
		return mav; 
	}
	
	// 로그인 처리 부분
	@RequestMapping(value="loginCheck", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String loginCheck(
			@RequestParam String userId,
			@RequestParam String userPwd,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		AES256 aes256 = new AES256();		
		Map<String,Object> paramData = new HashMap<String, Object>();
		paramData.put("userId", userId);
		paramData.put("userPwd", aes256.encrypt(userPwd));
		Map<String,Object> resultData = loginDAO.selectLoginCheck(paramData);
		if(resultData != null) {
			resultData.put("userName", aes256.encrypt(resultData.get("tmi_name").toString()));
			resultData.put("userId", aes256.encrypt(resultData.get("tmi_id").toString()));
			resultData.put("userLevel", aes256.encrypt(resultData.get("tmi_level").toString()));
			resultData.put("groupName", aes256.encrypt(resultData.get("tgi_name").toString()));
			resultData.put("groupCode", aes256.encrypt(resultData.get("tgi_code").toString()));
			resultData.put("userCode", aes256.encrypt(resultData.get("tmi_code").toString())); 
			resultData.put("levelName", aes256.encrypt(resultData.get("levelName").toString())); 
			common.setLoginInfoSession(request, resultData);
		}
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}	
	
	@RequestMapping(value="getLoginLevel", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String getLoginLevel(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", common.getSessionLoginLevel(request));	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	@RequestMapping(value="listGroupInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String listGroupInfo(HttpServletRequest request, HttpServletResponse response) throws Exception {
		List<Map<String,Object>> resultData = loginDAO.selectGroupInfo();
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	@RequestMapping(value="saveJoinInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String saveJoinInfo(@RequestParam Map<String,Object> formData, HttpServletRequest request, HttpServletResponse response) throws Exception {
		AES256 aes256 = new AES256();
		formData.put("user_pwd", aes256.encrypt(formData.get("user_pwd").toString()));		
		
		int resultData = loginDAO.saveJoinInfo(formData);		
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData); 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	@RequestMapping(value="getIdOverlapCheck", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String getIdOverlapCheck(@RequestParam String userId, HttpServletRequest request, HttpServletResponse response) throws Exception {
		int resultData = loginDAO.selectIdOverlapCheck(userId);		
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData); 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	@RequestMapping(value="findPaswordInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String findPaswordInfo(@RequestParam String findId, @RequestParam String findEmail,HttpServletRequest request, HttpServletResponse response) throws Exception {
		AES256 aes256 = new AES256();		
		Map<String,String> paramData = new HashMap<String, String>();
		paramData.put("findId", findId);
		paramData.put("findEmail", findEmail);
		String resultData = loginDAO.selectFindPassword(paramData);		
		if(resultData != null && resultData.trim() != "") resultData = aes256.decrypt(resultData);
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData); 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
}
