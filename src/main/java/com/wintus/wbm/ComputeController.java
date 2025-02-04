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
import com.wintus.wbm.dao.ComputeDAO;

import net.sf.json.JSONObject;

/**
 * Handles requests for the application home page.
 */
@Controller("computeController")
@EnableAspectJAutoProxy
public class ComputeController { 
	@Autowired
	private ComputeDAO computeDAO;
	
	private int sessionTmiCode;
	private int m_iLevel;
	
	private static final Logger logger = LoggerFactory.getLogger(ComputeController.class);
	
	// 관제센터 현황 정보 처음 페이지 로딩 시 처리..
	@RequestMapping(value= "compute" ,method={RequestMethod.POST,RequestMethod.GET})
	public ModelAndView compute(HttpServletRequest request, HttpServletResponse response) throws Exception{
		ModelAndView mav = new ModelAndView();
		int userLoginCode = common.getSessionLoginCode(request);
		
		if(userLoginCode <= 0) {
			mav.setViewName("redirect:/login");
		} else {
			mav.addObject("loginLevel", common.getSessionLoginLevel(request));
			mav.addObject("loginName", common.getSessionLoginName(request));
			mav.addObject("loginCode", common.getSessionLoginCode(request));
			mav.addObject("levelName", common.getSessionLevelName(request));
			mav.addObject("groupName", common.getSessionGroupName(request));
			mav.addObject("groupCode", common.getSessionGroupCode(request));
			// logger.info("mav=" + mav.toString());

			String viewName=(String)request.getAttribute("viewName");
			mav.setViewName(viewName);	 
		}		
		return mav; 
	}	
	
	@RequestMapping(value="listComputeInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String listComputeInfo(
			@RequestParam int searchType,
			@RequestParam String searchData,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		List<Map<String,Object>> resultData = null;
		int userCode = common.getSessionLoginCode(request);
		if(userCode <= 0) resultData = null;
		else {
			int userLevel = common.getSessionLoginLevel(request);
			int groupCode = common.getSessionGroupCode(request);
			
			Map<String,Object> paramData = new HashMap<String, Object>();
			paramData.put("searchType", searchType);
			paramData.put("searchData", searchData);
			
			resultData = computeDAO.selectComputeInfo(paramData);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	@RequestMapping(value="detailComputeInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String detailComputeInfo(@RequestParam int computeCode,HttpServletResponse response) throws Exception {
		Map<String,Object> resultData = computeDAO.selectDetailComputeInfo(computeCode);

		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}	
	
	@RequestMapping(value="saveComputeInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String saveComputeInfo(@RequestParam Map<String,Object> formData, HttpServletRequest request, HttpServletResponse response) throws Exception {
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {		
			formData.put("userCode", userLoginCode);
			resultData = computeDAO.saveComputeInfo(formData);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="removeComputeInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String removeComputeInfo(@RequestParam int computeCode,HttpServletRequest request, HttpServletResponse response) throws Exception {
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			resultData = computeDAO.deleteComputeInfo(computeCode);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
}
