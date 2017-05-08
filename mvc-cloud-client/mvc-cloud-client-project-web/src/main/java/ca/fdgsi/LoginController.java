package ca.fdgsi;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {
	
	@Value("${username}")
	private String username;

	@Value("${db.port}")
	private String port;
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	
	
	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}
	
	@RequestMapping(value="/user", method=RequestMethod.GET)
	public String getUserDetails() {
		
		Map<String, String> userMap = new HashMap<>();
		
		userMap.put("username",username);
		
		return userMap.toString();
	}

}
