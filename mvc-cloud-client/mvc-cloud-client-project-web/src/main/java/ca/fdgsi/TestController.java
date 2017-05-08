package ca.fdgsi;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class TestController {

	@RequestMapping(value="/frank", method=RequestMethod.GET)
	public String getUserDetails() {
		
		Map<String, String> userMap = new HashMap<>();
		
		userMap.put("username","frank");
		
		return userMap.toString();
	}
}
